package com.localizator.bus.util;

import java.util.Calendar;
import java.util.Date;

public class DateUtil {

    public static Date plusMinusDays(Date date, int days, boolean isPlus) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, isPlus ? days : days * -1);
        return cal.getTime();
    }
}
