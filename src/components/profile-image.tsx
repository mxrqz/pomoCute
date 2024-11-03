import Image from "next/image";

interface ProfileImage {
    src: string;
    fallback: string,
    className: string
}

export default function ProfileImage({ src, fallback, className }: ProfileImage) {
    return (
        <div className={className}>
            <Image src={src} width={24} height={24} alt="Imagem de perfil do usuário" />
            {!src && (
                <span>{fallback}</span>
            )}
        </div>
    )
}