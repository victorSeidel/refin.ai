import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], });

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], });

export const metadata: Metadata = 
{
    title: "refin.ai - Transforme Fotos em Imagens Profissionais para Anúncios",
    description: "Tecnologia avançada que converte fotos amadoras em imagens profissionais para anúncios. Aumente suas vendas com imagens impressionantes para e-commerce, imóveis e veículos",
    keywords: "refin.ai, edição de imagens, fotos profissionais, melhorar anúncios, e-commerce, transformação de fotos, refinamento de imagens, photoshop automático, anúncios, inteligência artificial, marketing digital, design criativo, geração de imagens",
    robots: "index, follow",
    authors: [{ name: "Vectoo" }],
    openGraph: 
    {
        type: "website",
        url: "https://refinai.vectoo.com.br/",
        title: "refin.ai - Transforme Fotos em Imagens Profissionais para Anúncios",
        description: "Tecnologia avançada para transformar suas fotos em imagens profissionais que aumentam conversões em anúncios",
        siteName: "Refin.ai",
        images: 
        [{
            url: "https://refinai.vectoo.com.br/assets/og-image.png",
            width: 1200,
            height: 630,
            alt: "Refin.ai - Imagem de capa",
        }],
        locale: "pt_BR",
    },
    twitter: 
    {
        card: "summary_large_image",
        title: "refin.ai - Transforme Fotos em Imagens Profissionais para Anúncios",
        description: "Tecnologia avançada para transformar suas fotos em imagens profissionais que aumentam conversões em anúncios",
        images: ["https://refinai.vectoo.com.br/assets/og-image.png"],
        site: "@refinai",
    },
    alternates: { canonical: "https://refinai.vectoo.com.br/" },
    icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) 
{
    return (
        <html lang="pt-BR">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
