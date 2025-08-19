import { Suspense } from "react";
import CriarPage from "./CriarPage";

export default function Page() 
{
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <CriarPage />
        </Suspense>
    );
}