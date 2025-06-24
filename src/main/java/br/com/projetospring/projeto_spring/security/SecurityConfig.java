package br.com.projetospring.projeto_spring.security;

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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsersDetailsService userDetailsService;

    public SecurityConfig(UsersDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilitado por padrão, útil para REST e testes — opcional ativar depois
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", "/home", "/index", "/login", "/cadastro/**", 
                    "/css/**", "/js/**", "/images/**", "/webjars/**"
                ).permitAll() // Libera páginas públicas e recursos estáticos
                .anyRequest().authenticated() // O resto exige login
            )
            .formLogin(login -> login
                .loginPage("/home") // Página de login customizada
                .loginProcessingUrl("/login") // Endpoint de autenticação (POST)
                .defaultSuccessUrl("/inicio", true) // Redireciona após login com sucesso
                .failureUrl("/home?error=true") // Em caso de erro, volta ao login com ?error
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/home") // Após logout, volta ao login
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService); // Nossa implementação
        provider.setPasswordEncoder(passwordEncoder());     // BCrypt encoder
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Segurança com hash forte
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager(); // Gerenciador de autenticação padrão
    }
}
