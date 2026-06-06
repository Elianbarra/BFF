package cl.rednorte.bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean("authClient")
    public RestClient authRestClient(@Value("${ms.auth.url}") String authUrl) {
        return RestClient.builder()
                .baseUrl(authUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean("userClient")
    public RestClient userRestClient(@Value("${ms.user.url}") String userUrl) {
        return RestClient.builder()
                .baseUrl(userUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean("appointmentClient")
    public RestClient appointmentRestClient(@Value("${ms.appointments.url}") String appointmentsUrl) {
        return RestClient.builder()
                .baseUrl(appointmentsUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean("waitlistClient")
    public RestClient waitlistRestClient(@Value("${ms.waitlist.url}") String waitlistUrl) {
        return RestClient.builder()
                .baseUrl(waitlistUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
