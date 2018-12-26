package com.localizator.bus.resolver;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.localizator.bus.implement.JoinSpecificationImpl;
import com.localizator.bus.implement.SpecificationImpl;
import com.localizator.bus.implement.SpecificationOrImpl;
import org.springframework.core.MethodParameter;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.persistence.criteria.JoinType;
import java.util.HashMap;

public class SpecificationArgumentResolver implements HandlerMethodArgumentResolver {

    private static final String DEFAULT_SPECIFICATION_PARAMETER = "parametros";

    private static final String DEFAULT_SPECIFICATION_JOIN = "joins";

    private static final String DEFAULT_DATE_PATTERN = "dateFormat";

    private HashMap<String, Object> hashMap = new HashMap<>();

    private final HashMap<String, JoinType> hashMapJoins = new HashMap<>();

    private String parametrosParameterName = DEFAULT_SPECIFICATION_PARAMETER;

    private final String joinsParameterName = DEFAULT_SPECIFICATION_JOIN;

    private final String dateFormatParameterName = DEFAULT_DATE_PATTERN;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return Specification.class.equals(parameter.getParameterType());
    }

    @Override
    public Specification resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        String parametro = webRequest.getParameter(parametrosParameterName);
        String dateFormat = webRequest.getParameter(dateFormatParameterName);
        String joins = webRequest.getParameter(joinsParameterName);
        boolean hasText = StringUtils.hasText(parametro);
        boolean hasJoinText = StringUtils.hasText(joins);
        if (hasJoinText) {
            String[] split = joins.split(",");
            for (String string : split) {
                hashMapJoins.put(string, JoinType.LEFT);
            }
            return new JoinSpecificationImpl(hashMapJoins);
        }
        if (!hasText) {
            return null;
        }
        hashMap = objectMapper.readValue(parametro, HashMap.class);
        if (hashMap == null) {
            return null;
        }
        if (dateFormat != null) {
            return new SpecificationOrImpl(hashMap, dateFormat);
        }
        return new SpecificationOrImpl(hashMap);
    }

    public String getParametrosParameterName() {
        return parametrosParameterName;
    }

    public void setParametrosParameterName(String parametrosParameterName) {
        this.parametrosParameterName = parametrosParameterName;
    }

    public HashMap<String, Object> getHashMap() {
        return hashMap;
    }

    public void setHashMap(HashMap<String, Object> hashMap) {
        this.hashMap = hashMap;
    }
}
