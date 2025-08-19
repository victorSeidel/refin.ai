import { NextRequest, NextResponse } from 'next/server';

import OpenAI, { toFile } from 'openai';
const apiKey = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) 
{
    try 
    {
        if (!apiKey) throw new Error('OPENAI_API_KEY não está definida nas variáveis de ambiente');
        const openai = new OpenAI({ apiKey: apiKey });

        const formData = await req.formData();

        const file = formData.get('file') as File;
        if (!file || !file.arrayBuffer) return NextResponse.json({ error: 'Arquivo não recebido corretamente' }, { status: 400 });
        if (!['image/png', 'image/jpeg'].includes(file.type)) return NextResponse.json({ error: 'Formato de arquivo não suportado. Use PNG ou JPEG.' }, { status: 400 });
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const image = await toFile(buffer, null, { type: "image/png", });

        const resolucao = formData.get('resolucao') as "auto" | "1024x1024" | "1536x1024" | "1024x1536";

        const prompt = 
        `
            You will receive a photo of an advertisement (such as food, real estate, vehicles, etc.). 
            Your task is to enhance the image to the highest professional quality standards, making it look as if it was taken by an experienced commercial photographer.

            The enhancement should include:
            - Improved lighting, shadows, and highlights for a clean and well-balanced look.
            - Sharper details and textures for a crisp, high-resolution appearance.
            - Color correction and white balance adjustment for natural yet vibrant tones.
            - Gentle contrast, brightness, and saturation adjustments to make the subject stand out.
            - Removal of visual noise, compression artifacts, or distracting elements in the background (if possible without altering the original composition).

            IMPORTANT: Maintain the original essence of the image:
            - Keep the colors, positions, proportions, and shapes true to reality.
            - Do not alter the product, its size, or features in a misleading way.
            - Do not add or remove significant objects that would change the perception of the ad.

            The result must remain truthful to the original scene, while looking like a professional, polished photograph ready for publication.
        `;
        
        const result = await openai.images.edit({ model: 'gpt-image-1', prompt: prompt, image: image, size: resolucao });
        if (!result || !result.data) return NextResponse.json({ error: 'Erro ao gerar imagem' }, { status: 500 });

        const image_base64 = result.data[0].b64_json;
        if (!image_base64) return NextResponse.json({ error: 'Nenhuma imagem retornada pela API' }, { status: 500 });

        return NextResponse.json({ base64: image_base64 }); 
    } 
    catch (error: unknown) 
    {
        console.error('Erro ao gerar imagem:', error);

        let message = 'Erro interno';
        if (error instanceof Error) message = error.message;

        return NextResponse.json({ error: message }, { status: 500 });
    }
}