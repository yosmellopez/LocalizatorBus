package com.localizator.bus.control;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class GeneralControl {

    @RequestMapping(value = {"/", "/{pagina}/{ruta}", "/login"})
    public ModelAndView inicio() {
        return new ModelAndView("index");
    }
}
