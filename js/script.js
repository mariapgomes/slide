import { NavegacaoSlide } from "./slide.js";

const slide = new NavegacaoSlide('.slide', '.slide-container', 'ativo');
slide.iniciaClasse();
slide.adicionaSetas('.anterior', '.proximo')
