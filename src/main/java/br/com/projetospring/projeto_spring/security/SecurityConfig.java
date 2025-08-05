package br.com.projetospring.projeto_spring.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsersDetailsService userDetailsService;

    @Autowired
    private DataSource dataSource;

    public SecurityConfig(UsersDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/home", "/", "/index",
                    "/css/**", "/js/**", "/images/**", "/webjars/**",
                    "/login/cadastro", "/login/**",
                    "/verificacao", "/verificacao/**",
                    "/verificar-email", "/verificar-email/**",
                    "/verificado", "/erro",
                    "/dados/completar", "/dados/foto", "/dados/existe", "/dados/**",
                    "/foto",
                    "/pacientes", "/pacientes/**",
                    "/anamnese", "/anamnese**",
                    "/lixeira", "/lixeira/**",
                    "/agendamentos", "/agendamentos/**",
                    "/servicos", "/servicos/**",
                    "/financeiro", "/financeiro/**")
                .permitAll()
                .anyRequest().authenticated())
            .formLogin(login -> login
                .loginPage("/home")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/inicio", true)
                .failureUrl("/home?error=true")
                .permitAll())
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/home")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID", "remember-me")
                .permitAll())
            .rememberMe(remember -> remember
                .key("minhaChaveSegura123")
                .rememberMeParameter("remember-me")
                .tokenValiditySeconds(60 * 60 * 24 * 30) // 30 dias
                .userDetailsService(userDetailsService)
                .tokenRepository(persistentTokenRepository()) // 🔥 ESSENCIAL
            );

        return http.build();
    }

    @Bean
    public PersistentTokenRepository persistentTokenRepository() {
        JdbcTokenRepositoryImpl repo = new JdbcTokenRepositoryImpl();
        repo.setDataSource(dataSource);
        return repo;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
