package com.localizator.bus.config;

import com.localizator.bus.security.AjaxLoginProcessingFilter;
import com.localizator.bus.security.AutenticacionAjaxExitosa;
import com.localizator.bus.security.AutenticacionAjaxFallida;
import com.localizator.bus.security.CustomCorsFilter;
import com.localizator.bus.security.jwt.JwtAuthenticationProvider;
import com.localizator.bus.security.jwt.JwtTokenAuthenticationProcessingFilter;
import com.localizator.bus.security.jwt.SkipPathRequestMatcher;
import com.localizator.bus.security.jwt.token.TokenExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;
import java.util.List;

import static com.localizator.bus.AppConstants.*;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, jsr250Enabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {


    private final UserDetailsService userDetailsService;

    private final TokenExtractor tokenExtractor;

    private final AutenticacionAjaxFallida autenticacionAjaxFallida;

    private final AutenticacionAjaxExitosa autenticacionAjaxExitosa;

    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    private final MessageSource messageSource;

    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService, TokenExtractor tokenExtractor, AutenticacionAjaxFallida autenticacionAjaxFallida, AutenticacionAjaxExitosa autenticacionAjaxExitosa, JwtAuthenticationProvider jwtAuthenticationProvider, MessageSource messageSource) {
        this.userDetailsService = userDetailsService;
        this.tokenExtractor = tokenExtractor;
        this.autenticacionAjaxFallida = autenticacionAjaxFallida;
        this.autenticacionAjaxExitosa = autenticacionAjaxExitosa;
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
        this.messageSource = messageSource;
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/recursos/static/**");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
        auth.authenticationProvider(jwtAuthenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        List<String> permitAllEndpointList = Arrays.asList(AUTHENTICATION_URL, LOGOUT_URL, REGISTRO_URL, REFRESH_TOKEN_URL, AUTHENTICATION_RESTORE_PASSWORD);
        http.csrf().disable().headers().defaultsDisabled().cacheControl().and().frameOptions().disable().and()
                .authorizeRequests()
                .antMatchers(AUTHENTICATION_URL).permitAll()
                .antMatchers(LOGOUT_URL).permitAll()
                .anyRequest().permitAll()
                .antMatchers("/login", "/api/auth/autenticated").permitAll()
                .antMatchers("/index.html").fullyAuthenticated()
                .and()
                .addFilterBefore(new CustomCorsFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(buildAjaxLoginProcessingFilter(AUTHENTICATION_URL), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(buildJwtTokenAuthenticationProcessingFilter(permitAllEndpointList, API_ROOT_URL), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling()
                .accessDeniedPage("/denegado.html").and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    public AuthenticationProvider daoAuthenticationProvider() throws Exception {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        provider.setMessageSource(messageSource);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private AjaxLoginProcessingFilter buildAjaxLoginProcessingFilter(String defaultProcessUrl) throws Exception {
        AjaxLoginProcessingFilter filter = new AjaxLoginProcessingFilter(defaultProcessUrl, autenticacionAjaxExitosa, autenticacionAjaxFallida);
        filter.setAuthenticationManager(authenticationManagerBean());
        return filter;
    }

    private JwtTokenAuthenticationProcessingFilter buildJwtTokenAuthenticationProcessingFilter(List<String> pathsToSkip, String pattern) throws Exception {
        SkipPathRequestMatcher skipPathRequestMatcher = new SkipPathRequestMatcher(pathsToSkip, pattern);
        JwtTokenAuthenticationProcessingFilter filter = new JwtTokenAuthenticationProcessingFilter(autenticacionAjaxFallida, tokenExtractor, skipPathRequestMatcher);
        filter.setAuthenticationManager(authenticationManagerBean());
        return filter;
    }
}
