package com.localizator.bus.implement;

import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class SpecificationOrImpl<T> implements Specification<T> {

    private HashMap<String, Object> hm;

    private String defaultDatePattern = "dd/MM/yyyy";

    public SpecificationOrImpl(HashMap<String, Object> hashMap) {
        this.hm = hashMap;
    }

    public SpecificationOrImpl(HashMap<String, Object> hashMap, String defaultDatePattern) {
        this.hm = hashMap;
        this.defaultDatePattern = defaultDatePattern;
    }

    public SpecificationOrImpl() {
        hm = new HashMap<>();
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        String multiple = "", valor1, claveRango = "", like = "";
        Join<Object, Object> ultimoJoin = null;
        LinkedList<Predicate> predicados = new LinkedList<>();
        Set<String> claves = hm.keySet();
        Date date;
        for (String clave : claves) {
            like = "";
            String valor = String.valueOf(hm.get(clave));
            if (valor != null && !valor.isEmpty() && !valor.equals("null")) {
                if (clave.contains("joinMultipleJM") && !valor.equals("")) {
                    LinkedList<Predicate> predicadosMultiples = new LinkedList<>();
                    ArrayList<Integer> enteros = (ArrayList<Integer>) hm.get(clave);
                    multiple = clave.substring(14);
                    String[] elementos = multiple.split("[.]");
                    for (int j = 0; j < elementos.length - 1; j++) {
                        ultimoJoin = j == 0 ? root.join(elementos[j]) : ultimoJoin.join(elementos[j]);
                    }
                    for (Integer entero : enteros) {
                        predicadosMultiples.add(cb.equal(ultimoJoin.get(elementos[elementos.length - 1]), entero));
                    }
                    Predicate[] toArray = predicadosMultiples.toArray(new Predicate[predicadosMultiples.size()]);
                    predicados.add(cb.or(toArray));
                } else if (clave.contains("multipleM") && !valor.equals("")) {
                    LinkedList<Predicate> predicadosMultiples = new LinkedList<>();
                    ArrayList<Integer> enteros = (ArrayList<Integer>) hm.get(clave);
                    multiple = clave.substring(9);
                    String[] elementos = multiple.split("[.]");
                    for (int j = 0; j < elementos.length - 1; j++) {
                        ultimoJoin = j == 0 ? root.join(elementos[j]) : ultimoJoin.join(elementos[j]);
                    }
                    for (Integer entero : enteros) {
                        predicadosMultiples.add(cb.equal(ultimoJoin.get(elementos[elementos.length - 1]), entero));
                    }
                    Predicate[] toArray = predicadosMultiples.toArray(new Predicate[predicadosMultiples.size()]);
                    predicados.add(cb.or(toArray));
                } else if (clave.contains("joinJ")) {
                    String join = clave.substring(5);
                    String[] elementos = join.split("[.]");
                    for (int i = 0; i < elementos.length - 1; i++) {
                        ultimoJoin = i == 0 ? root.join(elementos[i]) : ultimoJoin.join(elementos[i]);
                    }
                    predicados.add(cb.equal(ultimoJoin.get(elementos[elementos.length - 1]), valor));
                } else if (clave.contains("likeL")) {
                    like = clave.contains("likeL") ? clave.substring(5) : clave;
                    String[] split = like.split("[.]");
                    Path path = root.get(split[0]);
                    for (int j = 1; j < split.length; j++) {
                        path = path.get(split[j]);
                    }
                    predicados.add(cb.like(cb.lower(path), "%" + valor.toLowerCase() + "%"));
                } else if (clave.startsWith("rango")) {
                    claveRango = clave.contains("rangoI") ? clave.replaceFirst("I", "F") : clave.replaceFirst("F", "I");
                    valor1 = String.valueOf(hm.get(claveRango));
                    hm.replace(claveRango, null);
                    clave = clave.substring(6);
                    Date dateRango;
                    if (canParseValueToDate(valor) && canParseValueToDate(valor1)) {
                        try {
                            SimpleDateFormat dateFormat = new SimpleDateFormat(defaultDatePattern);
                            date = dateFormat.parse(valor);
                            dateRango = dateFormat.parse(valor1);
                            Predicate predicate = cb.between(root.get(clave), date.before(dateRango) ? date : dateRango, date.after(dateRango) ? date : dateRango);
                            predicados.add(predicate);
                        } catch (ParseException ex) {
                            ex.hashCode();
                        }
                    } else {
                        Predicate predicate = cb.between(root.get(clave), Integer.parseInt(valor.compareTo(valor1) == -1 ? valor : valor1), Integer.parseInt(valor.compareTo(valor1) != -1 ? valor : valor1));
                        predicados.add(predicate);
                    }
                } else if (canParseValueToDate(valor)) {
                    try {
                        SimpleDateFormat dateFormat = new SimpleDateFormat(defaultDatePattern);
                        date = dateFormat.parse(valor);
                        predicados.add(cb.equal(root.get(clave), date));
                    } catch (ParseException ex) {
                        ex.hashCode();
                    }
                } else if (valor.equals("true") || valor.equals("false")) {
                    String[] split = clave.split("[.]");
                    if (split.length != 1) {
                        Path path = root.get(split[0]);
                        for (int j = 1; j < split.length; j++) {
                            path = path.get(split[j]);
                        }
                        predicados.add(cb.equal(path, valor.equals("true")));
                    } else {
                        predicados.add(cb.equal(root.get(clave), valor.equals("true")));
                    }
                } else if (!valor.matches("[0-9]*")) {
                    String[] split = clave.split("[.]");
                    if (split.length != 1) {
                        Path path = root.get(split[0]);
                        for (int j = 1; j < split.length; j++) {
                            path = path.get(split[j]);
                        }
                        predicados.add(cb.equal(path, valor));
                    } else {
                        predicados.add(cb.equal(root.get(clave), valor));
                    }
                } else {
                    String[] split = clave.split("[.]");
                    if (split.length != 1) {
                        Path path = root.get(split[0]);
                        for (int j = 1; j < split.length; j++) {
                            path = path.get(split[j]);
                        }
                        predicados.add(cb.equal(path, valor));
                    } else {
                        predicados.add(cb.equal(root.get(clave), valor));
                    }
                }
            }
        }
        Predicate[] toArray = predicados.toArray(new Predicate[predicados.size()]);
        return predicados.size() == 1 ? predicados.get(0) : cb.or(toArray);

    }

    public HashMap<String, Object> getHm() {
        return hm;
    }

    public void setHm(HashMap<String, Object> hm) {
        this.hm = hm;
    }

    public String getDefaultDatePattern() {
        return defaultDatePattern;
    }

    public void setDefaultDatePattern(String defaultDatePattern) {
        this.defaultDatePattern = defaultDatePattern;
    }

    private boolean canParseValueToDate(String valor) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat(defaultDatePattern);
            dateFormat.parse(valor);
            return true;
        } catch (ParseException ex) {
            ex.hashCode();
            return false;
        }
    }
}
