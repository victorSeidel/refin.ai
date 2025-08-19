'use client'
import React, { useState, useRef } from 'react'
import { Sparkles, ArrowRight, Menu, X, Check, Brain, CloudLightning  } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'

import NextImage from "next/image";
import comidaAntes from './assets/comida_antes.png'
import comidaDepois from './assets/comida_depois.png'
import carroAntes from './assets/carro_antes.png'
import carroDepois from './assets/carro_depois.png'
import roupaAntes from './assets/roupa_antes.png'
import roupaDepois from './assets/roupa_depois.png'

import { pacotes } from '@/models/pacotes';

import emailjs from '@emailjs/browser';

export default function HomePage() 
{
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => { setIsMenuOpen(!isMenuOpen) }

    const scrollToSection = (sectionId: string) => 
    {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    }

    const form = useRef<HTMLFormElement>(null);
    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => 
    {
        e.preventDefault();

        if (!form.current) return;

        emailjs.sendForm('service_5w9ufpp', 'template_wkmwv8x', form.current, 'wpopxT_tpmyjL4Xlh')
        .then(() => { alert('Mensagem enviada! Entraremos em contato em breve.'); form.current?.reset(); }, 
        () => { alert('Ocorreu um erro ao enviar a mensagem. Tente novamente.'); });
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="ml-2 h-4 w-4 text-amber-400" />
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">refin.ai</span>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <button onClick={() => scrollToSection('home')} className="text-sm font-medium hover:text-amber-400 transition-colors cursor-pointer">
                                Início
                            </button>
                            <button onClick={() => scrollToSection('portfolio')} className="text-sm font-medium hover:text-amber-400 transition-colors cursor-pointer">
                                Portfólio
                            </button>
                            <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium hover:text-amber-400 transition-colors cursor-pointer">
                                Preços
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:text-amber-400 transition-colors cursor-pointer">
                                Contato
                            </button>
                        </nav>

                        <div className="hidden md:flex items-center space-x-4">
                            <Button size="sm" onClick={() => window.location.href = "/comprar"}
                                className="font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white 
                                    shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                                Experimente Agora
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <button onClick={toggleMenu} aria-label="Menu"
                                className="md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors">
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                                className="md:hidden overflow-hidden">
                            <div className="py-4 border-t border-gray-800">
                                <nav className="flex flex-col space-y-4">
                                    <button onClick={() => scrollToSection('home')} 
                                            className="text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">
                                        Início
                                    </button>
                                    <button onClick={() => scrollToSection('portfolio')} 
                                            className="text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">
                                        Portfólio
                                    </button>
                                    <button onClick={() => scrollToSection('pricing')} 
                                            className="text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">
                                        Preços
                                    </button>
                                    <button onClick={() => scrollToSection('contact')} 
                                            className="text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">
                                        Contato
                                    </button>
                                    <div className="flex flex-col space-y-2 pt-2 px-4">
                                        <Button size="sm" onClick={() => window.location.href = "/comprar"}
                                                className="font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                                            Experimente Agora
                                        </Button>
                                    </div>
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 opacity-90"></div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Badge variant="secondary" className="mb-6 bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Tecnologia Avançada
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                            Transforme seus anúncios em <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                obras de arte </span> e aumente suas vendas
                        </motion.h1>
                        
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                            Tecnologia avançada que converte fotos de baixa qualidade em imagens profissionais para seus anúncios
                        </motion.p>
                        
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => window.location.href = "/conta?pacote=3"}
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-lg px-8 py-6 text-white 
                                        shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                                Experimente Agora
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => scrollToSection('portfolio')}
                                    className="text-lg px-8 py-6 bg-gray-800/50 tr border-amber-400 text-amber-400 ansition-colors">
                                Ver Exemplos
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                                className="text-3xl sm:text-4xl font-bold mb-4"> 
                            Por que escolher a <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">refin.ai</span>? 
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Nossa tecnologia revolucionária oferece resultados incomparáveis
                        </motion.p>
                    </div>
                
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <Card className="bg-gray-900 border-gray-800 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all h-full">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500/10 to-amber-500/20 rounded-full flex items-center justify-center">
                                        <Brain className="w-8 h-8 text-amber-400" />
                                    </div>
                                    <CardTitle className="text-amber-400">Tecnologia Avançada</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Algoritmos que entendem o contexto da sua imagem
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <Card className="bg-gray-900 border-gray-800 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all h-full">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500/10 to-amber-500/20 rounded-full flex items-center justify-center">
                                        <CloudLightning  className="w-8 h-8 text-amber-400" />
                                    </div>
                                    <CardTitle className="text-amber-400">Rapidez Incomparável</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Resultados em poucos minutos, não horas nem dias
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}>
                            <Card className="bg-gray-900 border-gray-800 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all h-full">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500/10 to-amber-500/20 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-amber-400" />
                                    </div>
                                    <CardTitle className="text-amber-400">Qualidade Profissional</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Transforme fotos amadoras em imagens de nível publicitário
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                                className="text-3xl sm:text-4xl font-bold mb-4">
                            Veja a Transformação 
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Exemplos reais de como transformamos as suas imagens
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                                <NextImage src={comidaAntes} loading="lazy" alt="Foto de um hambúrguer antes da edição - foto amadora com iluminação irregular" 
                                    className="absolute top-0 left-0 h-full w-1/2 object-cover rounded-l-xl" />
                                <NextImage src={comidaDepois} loading="lazy" alt="Foto do hambúrguer depois da edição - foto profissional com cores vibrantes e iluminação perfeita" 
                                    className="absolute top-0 right-0 h-full w-1/2 object-cover rounded-r-xl" />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <div className="relative before-after-slider aspect-video rounded-xl overflow-hidden shadow-xl">
                                <NextImage src={carroAntes} loading="lazy" alt="Foto de um carro antes da edição - foto escura com reflexos borrados"
                                    className="absolute top-0 left-0 h-full w-1/2 object-cover rounded-l-xl" />
                                <NextImage src={carroDepois} loading="lazy" alt="Foto do carro depois da edição - foto profissional com brilho intenso e reflexos nítidos" 
                                    className="absolute top-0 right-0 h-full w-1/2 object-cover rounded-r-xl" />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}>
                            <div className="relative before-after-slider aspect-video rounded-xl overflow-hidden shadow-xl">
                                <NextImage src={roupaAntes} loading="lazy" alt="Foto de uma blusa antes da edição - foto escura e desfocada"
                                    className="absolute top-0 left-0 h-full w-1/2 object-cover rounded-l-xl" />
                                <NextImage src={roupaDepois} loading="lazy" alt="Foto da blusa depois da edição - foto profissional com foco e iluminação melhor" 
                                    className="absolute top-0 right-0 h-full w-1/2 object-cover rounded-r-xl" />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}
                            className="w-full flex justify-center mt-12">
                        <Button size="lg" onClick={() => scrollToSection('pricing')}
                                className="font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white 
                                    shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                                Quero Transformar Minhas Imagens
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                                className="text-3xl sm:text-4xl font-bold mb-4">
                            Pacotes e Preços 
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Escolha o pacote ideal para suas necessidades
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <Card className="relative bg-gray-900 border-gray-800 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all h-full">                         
                                <CardHeader>
                                    <CardTitle className="text-white">{pacotes[0].nome}</CardTitle>
                                    <div className="text-3xl font-bold text-white">R$ {pacotes[0].valor.toString().replace('.', ',')}</div>
                                    <span className="text-sm text-amber-400 font-medium">
                                        {pacotes[0].imagens} imagens incríveis
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">{pacotes[0].imagens} imagens</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">Resolução alta</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">{"Sem marca d'água"}</span>
                                        </li>
                                    </ul>
                                    <Button onClick={() => window.location.href = "/comprar?pacote=1"}
                                        className="w-full font-bold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border
                                            border-gray-700 hover:border-amber-500/30 transition-all">
                                        Começar Agora
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <Card className="relative bg-gray-900 border-gray-800 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all h-full">                         
                                <CardHeader>
                                    <CardTitle className="text-white">{pacotes[1].nome}</CardTitle>
                                    <div className="text-3xl font-bold text-white">R$ {pacotes[1].valor.toString().replace('.', ',')}</div>
                                    <span className="text-sm text-amber-400 font-medium">
                                        Economize {Math.round(((pacotes[0].valor * (pacotes[1].imagens / pacotes[0].imagens) - pacotes[1].valor) 
                                                    / (pacotes[0].valor * (pacotes[1].imagens / pacotes[0].imagens)) ) * 100)}%
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">{pacotes[1].imagens} imagens</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">Resolução alta</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">{"Sem marca d'água"}</span>
                                        </li>
                                    </ul>
                                    <Button onClick={() => window.location.href = "/comprar?pacote=2"}
                                        className="w-full font-bold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border
                                            border-gray-700 hover:border-amber-500/30 transition-all">
                                        Começar Agora
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}>
                            <Card className="relative bg-gray-900 border-2 border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all h-full">
                                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white 
                                        shadow-md shadow-amber-500/20">
                                    Promoção Especial
                                </Badge>
                                <CardHeader>
                                    <CardTitle className="text-white">{pacotes[2].nome}</CardTitle>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-gray-400 line-through text-lg">R$ {(pacotes[2].valor * 1.4).toFixed(2).toString().replace('.', ',')}</span>
                                        <span className="text-3xl font-bold text-white">R$ {pacotes[2].valor.toString().replace('.', ',')}</span>
                                    </div>
                                    <span className="text-sm text-amber-400 font-medium">
                                        Economize {Math.round(((pacotes[1].valor * (pacotes[2].imagens / pacotes[1].imagens) - pacotes[2].valor) 
                                                    / (pacotes[1].valor * (pacotes[2].imagens / pacotes[1].imagens))) * 140)}%
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">{pacotes[2].imagens} imagens</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">Resolução máxima</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="w-5 h-5 mr-2 text-amber-400 bg-amber-400/10 rounded-full p-1" />
                                            <span className="text-gray-300">{"Sem marca d'água"}</span>
                                        </li>
                                    </ul>
                                    <Button onClick={() => window.location.href = "/comprar?pacote=3"}
                                            className=" w-full font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
                                                text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                                        Aproveitar Promoção
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Entre em Contato</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Pronto para transformar suas imagens? Fale conosco!
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-transparent">
                            <CardHeader>
                                <CardTitle className="text-white">Envie sua mensagem</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form ref={form} onSubmit={sendEmail} className="space-y-4 text-white">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Nome</label>
                                        <Input name="user_name" placeholder="Seu nome" required />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input type="email" name="user_email" placeholder="seu@email.com" required />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Mensagem</label>
                                        <Textarea name="message" placeholder="Conte-nos sobre seu negócio..." rows={4} required />
                                    </div>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                                        Enviar Mensagem
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted py-12 bg-gradient-to-b from-gray-900 to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Sparkles className="ml-2 h-4 w-4 text-amber-400" />
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">refin.ai</span>
                        </div>
                        <p className="text-white mb-4"> Transformando imagens com tecnologia avançada </p>
                        <div className="flex justify-center space-x-6 text-sm text-white">
                            <span>contato@vectoo.com.br</span>
                        </div>
                        <div className="mt-4 text-sm text-gray-400">
                            Horário de atendimento: Segunda a Sexta, 8h às 18h
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-muted-foreground">
                            © 2025 Vectoo. Todos os direitos reservados.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}