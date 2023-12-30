package com.backend.mixonat.configuration;

import com.backend.mixonat.filter.JwtAuthenticationFilter;
import com.backend.mixonat.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfigurer {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService.userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder);

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                antMatcher(HttpMethod.GET, "/user/{id}"),
                                antMatcher(HttpMethod.PUT, "/user/sign-up"),
                                antMatcher(HttpMethod.POST, "/user/sign-in"),
                                antMatcher(HttpMethod.DELETE, "/user/delete-account"),
                                antMatcher(HttpMethod.OPTIONS, "/user"),
                                antMatcher(HttpMethod.OPTIONS, "/user/id"),
                                antMatcher(HttpMethod.OPTIONS, "/user/sign-up"),
                                antMatcher(HttpMethod.OPTIONS, "/user/sign-in"),
                                antMatcher(HttpMethod.OPTIONS, "/user/delete-account")).permitAll()
                        .requestMatchers(
                                antMatcher(HttpMethod.GET, "/user"),
                                antMatcher(HttpMethod.GET, "/user/id")).hasAnyRole("ADMIN", "USER")
                        .requestMatchers(
                                antMatcher(HttpMethod.GET, "/sdf/list"),
                                antMatcher(HttpMethod.GET, "/rmn/list"),
                                antMatcher(HttpMethod.GET, "/sdf/{id}"),
                                antMatcher(HttpMethod.GET, "/rmn/{id}"),
                                antMatcher(HttpMethod.POST, "/motor"),
                                antMatcher(HttpMethod.POST, "/checkFile"),
                                antMatcher(HttpMethod.OPTIONS, "/motor"),
                                antMatcher(HttpMethod.OPTIONS, "/sdf"),
                                antMatcher(HttpMethod.OPTIONS, "/rmn"),
                                antMatcher(HttpMethod.OPTIONS, "/checkFile")).permitAll()
                        .requestMatchers(
                                antMatcher(HttpMethod.POST, "/sdf"),
                                antMatcher(HttpMethod.POST, "/rmn"),
                                antMatcher(HttpMethod.DELETE, "/sdf"),
                                antMatcher(HttpMethod.DELETE, "/rmn")).hasAnyRole("ADMIN", "USER")
                        .anyRequest()
                        .authenticated()
                )
                .authenticationProvider(authenticationProvider()).addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
