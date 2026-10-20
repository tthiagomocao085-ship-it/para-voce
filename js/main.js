
/* =========================================================
   PARA VOCÊ — SISTEMA DE INTERAÇÕES
   Arquivo: js/main.js

   Recursos:
   1. Campo de estrelas dinâmico
   2. Brilhos com movimento suave
   3. Navegação entre páginas
   4. Respeito à preferência por movimento reduzido
   5. Tratamento de erros e compatibilidade
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    initializeStars();
    initializePageNavigation();

    /* -----------------------------------------------------
       01. CAMPO DE ESTRELAS
       ----------------------------------------------------- */

    function initializeStars() {
        const starsLayer = document.querySelector(".stars-layer");

        if (!starsLayer || prefersReducedMotion) {
            return;
        }

        // Evita criar estrelas duplicadas.
        if (starsLayer.querySelector(".generated-star")) {
            return;
        }

        const isMobile = window.matchMedia(
            "(max-width: 600px)"
        ).matches;

        const starCount = isMobile ? 24 : 48;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement("span");

            star.className = "generated-star";

            const size = randomBetween(1, 2.4);
            const duration = randomBetween(3, 8);
            const delay = randomBetween(0, 6);

            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;

            star.style.setProperty("--star-size", `${size}px`);
            star.style.setProperty(
                "--star-duration",
                `${duration}s`
            );
            star.style.setProperty(
                "--star-delay",
                `-${delay}s`
            );

            fragment.appendChild(star);
        }

        starsLayer.appendChild(fragment);
    }


    /* -----------------------------------------------------
       02. VALORES ALEATÓRIOS
       ----------------------------------------------------- */

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }


    /* -----------------------------------------------------
       03. NAVEGAÇÃO ENTRE PÁGINAS
       ----------------------------------------------------- */

    function initializePageNavigation() {
        const links = document.querySelectorAll(
            'a[href$=".html"]:not([target="_blank"])'
        );

        links.forEach((link) => {
            link.addEventListener("click", (event) => {
                const destination = link.getAttribute("href");

                // Não interfere em âncoras, links externos ou
                // atalhos do navegador.
                if (
                    !destination ||
                    destination.startsWith("#") ||
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                ) {
                    return;
                }

                // Se o usuário prefere movimento reduzido,
                // deixa a navegação normal do navegador.
                if (prefersReducedMotion) {
                    return;
                }

                // Só intercepta links HTML do próprio site.
                let destinationURL;

                try {
                    destinationURL = new URL(
                        destination,
                        window.location.href
                    );
                } catch {
                    return;
                }

                if (
                    destinationURL.origin !== window.location.origin
                ) {
                    return;
                }

                event.preventDefault();

                document.body.classList.add("page-leaving");

                window.setTimeout(() => {
                    window.location.href = destinationURL.href;
                }, 220);
            });
        });
    }
});
