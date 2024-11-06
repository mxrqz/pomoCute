import { Rubik_Mono_One, } from "next/font/google"
import { Baloo_Paaji_2 } from "next/font/google"

const rubik = Rubik_Mono_One({
    weight: ['400'],
    subsets: ['latin']
})

const baloo = Baloo_Paaji_2({ subsets: ['latin'], display: 'swap' })

export { rubik, baloo }