// ===================================
// BORRACHARIA 40 - RASTREIO DE ORIGEM
// Descobre de onde veio cada visitante e marca cada clique no WhatsApp.
// Nao depende de nenhum servico externo para funcionar: a etiqueta de origem
// viaja dentro da propria mensagem do WhatsApp.
// ===================================

(function () {
    'use strict';

    // --- Configuracao (preencher os IDs quando as contas estiverem criadas) ---
    const CONFIG = {
        site: 'cama-ar-90-90-18',      // identifica qual dos dois sites gerou o lead
        ga4: '',                  // ID do Google Analytics 4. Ex: 'G-ABC123DEF4'
        adsId: '',                // ID do Google Ads. Ex: 'AW-123456789'
        adsLabel: '',             // Rotulo da conversao. Ex: 'aBcDeFgHiJ'
        codigoNaMensagem: false   // true acrescenta um "(ref XXXX)" no fim da mensagem
    };

    const DIAS_DE_MEMORIA = 90;
    const CHAVE = 'b40_origem';
    const CHAVE_CODIGO = 'b40_codigo';

    // --- Armazenamento tolerante a falhas (aba anonima, cookies bloqueados) ---
    function ler(chave) {
        try { return window.localStorage.getItem(chave); } catch (e) { return null; }
    }
    function gravar(chave, valor) {
        try { window.localStorage.setItem(chave, valor); } catch (e) { /* segue sem memoria */ }
    }

    // --- Identifica a origem da visita ---
    const PARAMS = new URLSearchParams(window.location.search);

    function paramLimpo(nome) {
        const v = PARAMS.get(nome);
        return v ? v.trim().slice(0, 60) : '';
    }

    function detectarOrigem() {
        const gclid = paramLimpo('gclid') || paramLimpo('gbraid') || paramLimpo('wbraid');
        const fbclid = paramLimpo('fbclid');
        const utmSource = paramLimpo('utm_source');
        const utmMedium = paramLimpo('utm_medium');
        const utmCampaign = paramLimpo('utm_campaign');
        const utmContent = paramLimpo('utm_content');
        const utmTerm = paramLimpo('utm_term');

        let canal;
        if (gclid || utmSource === 'google' && utmMedium === 'cpc') {
            canal = 'google-ads';
        } else if (fbclid || /^(facebook|fb|instagram|ig)$/.test(utmSource) && /cpc|paid|ads?/.test(utmMedium)) {
            canal = /instagram|ig/.test(utmSource) ? 'instagram-ads' : 'facebook-ads';
        } else if (utmSource) {
            canal = utmSource.toLowerCase();
        } else if (document.referrer) {
            let host = '';
            try { host = new URL(document.referrer).hostname.replace(/^www\./, ''); } catch (e) {}
            if (!host || host === window.location.hostname) {
                canal = 'direto';
            } else if (/google\./.test(host)) {
                canal = 'google-organico';
            } else if (/instagram\.com|l\.instagram\.com/.test(host)) {
                canal = 'instagram';
            } else if (/facebook\.com|fb\.me|l\.facebook\.com/.test(host)) {
                canal = 'facebook';
            } else if (/whatsapp\.com|wa\.me/.test(host)) {
                canal = 'whatsapp';
            } else {
                canal = host;
            }
        } else {
            canal = 'direto';
        }

        return {
            canal: canal,
            campanha: utmCampaign || (gclid ? 'google-ads' : '') || (fbclid ? 'facebook-ads' : ''),
            anuncio: utmContent || '',
            termo: utmTerm || '',
            gclid: gclid || '',
            fbclid: fbclid || '',
            pagina: window.location.pathname,
            data: new Date().toISOString().slice(0, 10)
        };
    }

    // Primeiro toque manda: se a pessoa ja visitou vinda do anuncio e volta
    // depois direto, o credito continua sendo do anuncio.
    function origemPersistida() {
        const agora = detectarOrigem();
        const salvoBruto = ler(CHAVE);

        if (salvoBruto) {
            try {
                const salvo = JSON.parse(salvoBruto);
                const idade = (Date.now() - (salvo.ts || 0)) / 86400000;
                const visitaNova = agora.canal !== 'direto';
                if (idade < DIAS_DE_MEMORIA && !visitaNova) {
                    return salvo.dados;
                }
            } catch (e) { /* registro corrompido: sobrescreve */ }
        }

        gravar(CHAVE, JSON.stringify({ ts: Date.now(), dados: agora }));
        return agora;
    }

    // --- Codigo curto que identifica o visitante na conversa do WhatsApp ---
    function codigoVisitante() {
        let codigo = ler(CHAVE_CODIGO);
        if (!codigo) {
            codigo = Math.random().toString(36).toUpperCase().slice(2, 6);
            gravar(CHAVE_CODIGO, codigo);
        }
        return codigo;
    }

    const ORIGEM = origemPersistida();
    const CODIGO = codigoVisitante();
    const DISPOSITIVO = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Celular' : 'Computador';

    const NOMES = {
        'google-ads': 'Google Ads (anuncio pago)',
        'facebook-ads': 'Facebook Ads (anuncio pago)',
        'instagram-ads': 'Instagram Ads (anuncio pago)',
        'google-organico': 'Busca do Google',
        'instagram': 'Instagram',
        'facebook': 'Facebook',
        'whatsapp': 'WhatsApp',
        'direto': 'Digitou o link / QR Code'
    };

    function nomeDoCanal() {
        return NOMES[ORIGEM.canal] || ORIGEM.canal;
    }

    // --- Redacao da mensagem conforme o canal ---
    // Em vez de carimbar a origem na frente do cliente, cada canal abre a
    // mensagem de um jeito. Quem le a conversa reconhece a origem na primeira
    // linha, e para o cliente e so uma frase normal.
    const ABERTURAS = {
        'google-ads': 'vi o an\u00fancio de voc\u00eas',
        'facebook-ads': 'vim pelo Facebook',
        'instagram-ads': 'vim pelo Instagram',
        'facebook': 'vim pelo Facebook',
        'instagram': 'vim pelo Instagram',
        'google-organico': 'achei voc\u00eas no Google',
        'whatsapp': 'me indicaram voc\u00eas',
        'direto': 'vim pelo site'
    };

    function aberturaDoCanal() {
        return ABERTURAS[ORIGEM.canal] || 'vim pelo site';
    }

    function personalizarMensagem(texto) {
        const abertura = aberturaDoCanal();
        let saida;

        if (texto.indexOf('Vim pelo site') !== -1) {
            // Caso comum: a propria frase do site vira a frase do canal.
            saida = texto.replace('Vim pelo site', abertura.charAt(0).toUpperCase() + abertura.slice(1));
        } else {
            const saudacao = texto.match(/^(Ol\u00e1!|Ola!|Oi!)\s*/);
            if (saudacao) {
                saida = saudacao[0].trim() + ' ' + abertura.charAt(0).toUpperCase() + abertura.slice(1) + '. '
                      + texto.slice(saudacao[0].length);
            } else {
                saida = abertura.charAt(0).toUpperCase() + abertura.slice(1) + '. ' + texto;
            }
        }

        if (CONFIG.codigoNaMensagem) saida += ' (ref ' + CODIGO + ')';
        return saida;
    }

    // --- Onde da pagina a pessoa clicou ---
    function localDoLink(a) {
        const id = a.id || '';
        const classe = a.className || '';
        if (id === 'whatsapp-float' || /whatsapp-float/.test(classe)) return 'botao-flutuante';
        if (/nav__mobile/.test(classe)) return 'menu-celular';
        if (/nav__cta|nav__link/.test(classe)) return 'menu-topo';
        if (id.indexOf('hero') === 0) return 'topo-da-pagina';
        if (id.indexOf('showcase') === 0) return 'ficha-do-produto';
        if (id.indexOf('cta-banner') === 0) return 'faixa-promocional';
        if (id.indexOf('location') === 0 || /location/.test(classe)) return 'secao-localizacao';
        if (/footer/.test(classe)) return 'rodape';
        return 'outro';
    }

    // --- Envio dos eventos para os paineis (cada um so dispara se existir) ---
    function registrarEvento(nome, dados) {
        const carga = Object.assign({
            site: CONFIG.site,
            canal: ORIGEM.canal,
            campanha: ORIGEM.campanha || '(nenhuma)',
            dispositivo: DISPOSITIVO,
            codigo: CODIGO
        }, dados || {});

        // Vercel Web Analytics
        if (typeof window.va === 'function') {
            window.va('event', { name: nome, data: carga });
        }

        // Google Analytics 4
        if (typeof window.gtag === 'function') {
            window.gtag('event', nome, carga);
        }

        // Conversao do Google Ads (so no clique do WhatsApp)
        if (nome === 'whatsapp_click' && typeof window.gtag === 'function' && CONFIG.adsId && CONFIG.adsLabel) {
            window.gtag('event', 'conversion', {
                send_to: CONFIG.adsId + '/' + CONFIG.adsLabel
            });
        }
    }

    // --- Carrega o gtag apenas se algum ID estiver configurado ---
    function carregarGoogleTag() {
        const idPrincipal = CONFIG.ga4 || CONFIG.adsId;
        if (!idPrincipal) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        if (CONFIG.ga4) window.gtag('config', CONFIG.ga4);
        if (CONFIG.adsId) window.gtag('config', CONFIG.adsId);

        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + idPrincipal;
        document.head.appendChild(s);
    }

    // --- Marca todos os links de WhatsApp da pagina ---
    function marcarLinksWhatsApp() {
        document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(function (a) {
            if (a.dataset.b40) return;
            a.dataset.b40 = '1';
            a.dataset.b40local = localDoLink(a);

            try {
                const url = new URL(a.href);
                const texto = url.searchParams.get('text')
                    || 'Ol\u00e1! Vim pelo site e gostaria de falar com a Borracharia 40.';
                url.searchParams.set('text', personalizarMensagem(texto));
                a.href = url.toString();
            } catch (e) { /* link malformado: mantem como esta */ }

            a.addEventListener('click', function () {
                registrarEvento('whatsapp_click', { local: a.dataset.b40local });
            });
        });
    }

    // --- Cliques em mapa e telefone ---
    function marcarOutrosContatos() {
        document.querySelectorAll('a[href*="google.com/maps"], a[href*="maps.google"]').forEach(function (a) {
            if (a.dataset.b40) return;
            a.dataset.b40 = '1';
            a.addEventListener('click', function () {
                registrarEvento('mapa_click', { local: localDoLink(a) });
            });
        });

        document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
            if (a.dataset.b40) return;
            a.dataset.b40 = '1';
            a.addEventListener('click', function () {
                registrarEvento('telefone_click', { local: localDoLink(a) });
            });
        });
    }

    // --- Sinais de interesse real (separa quem leu de quem so passou) ---
    function medirEngajamento() {
        let marcouRolagem = false;
        let marcouTempo = false;

        window.addEventListener('scroll', function () {
            if (marcouRolagem) return;
            const altura = document.documentElement.scrollHeight - window.innerHeight;
            if (altura > 0 && (window.pageYOffset / altura) >= 0.75) {
                marcouRolagem = true;
                registrarEvento('leu_a_pagina', {});
            }
        }, { passive: true });

        window.setTimeout(function () {
            if (marcouTempo || document.hidden) return;
            marcouTempo = true;
            registrarEvento('visita_engajada', {});
        }, 30000);
    }

    function iniciar() {
        carregarGoogleTag();
        marcarLinksWhatsApp();
        marcarOutrosContatos();
        medirEngajamento();
        registrarEvento('visita', { pagina: ORIGEM.pagina });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }

    // Exposto para conferencia no console do navegador
    window.B40 = { origem: ORIGEM, codigo: CODIGO, dispositivo: DISPOSITIVO };
})();
