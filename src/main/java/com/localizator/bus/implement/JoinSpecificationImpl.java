/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.localizator.bus.implement;

import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.HashMap;
import java.util.Set;

public class JoinSpecificationImpl<T> implements Specification<T> {

    private HashMap<String, JoinType> hm;

    public JoinSpecificationImpl(HashMap<String, JoinType> hashMap) {
        this.hm = hashMap;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Set<String> keySet = hm.keySet();
        query.distinct(true);
        for (String key : keySet) {
            root.join(key, hm.get(key));
        }
        return root.isNotNull();
    }

}
