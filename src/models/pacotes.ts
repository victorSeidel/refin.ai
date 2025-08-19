interface Pacote 
{
    id: number,
    nome: string,
    valor: number,
    imagens: number,
};

const pacotes = 
[
    {
        id: 1,
        nome: 'Básico',
        valor: 19.99,
        imagens: 5,
    },
    {
        id: 2,
        nome: 'Avançado',
        valor: 39.99,
        imagens: 15,
    },
    {
        id: 3,
        nome: 'Superior',
        valor: 54.99,
        imagens: 30,
    }  
]

export type { Pacote };
export { pacotes };