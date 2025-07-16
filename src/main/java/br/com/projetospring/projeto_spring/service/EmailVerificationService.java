package br.com.projetospring.projeto_spring.service;

import java.util.Optional;
import java.util.UUID;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private Environment environment;

    public void enviarTokenConfirmacao(Users users) {
        String token = UUID.randomUUID().toString();
        users.setTokenVerificacao(token);
        users.setVerificado(false);
        users.setAtivo(false);
        usersRepository.save(users);

        // Pega a URL do backend
        String backendUrl = environment.getProperty("app.url.backend", "https://minha-agencia-backend.onrender.com");

        // Gera link com token
        String link = backendUrl + "/verificacao?token=" + token;

        String assunto = "Confirmação de e-mail";
        String conteudo = "<h2>Olá, " + users.getUsers() + "</h2>"
                + "<p>Clique no link abaixo para verificar seu e-mail:</p>"
                + "<a href=\"" + link + "\">Verificar E-mail</a>";

        try {
            enviarEmail(users.getEmail(), assunto, conteudo);
        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar e-mail de verificação", e);
        }
    }

    private void enviarEmail(String para, String assunto, String conteudoHtml) throws MessagingException {
        MimeMessage mensagem = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

        helper.setTo(para);
        helper.setSubject(assunto);
        helper.setText(conteudoHtml, true);

        mailSender.send(mensagem);
    }

    public Optional<Users> validarToken(String token) {
        return usersRepository.findByTokenVerificacao(token);
    }
}
