import { z } from "zod"

// --- 01 ---
const usernameSchema = z.string().min(3).max(20)


// --- 02 ---
const userSchema = z.object({
    email: z.email("Email inválido"),
    age: z.number().min(18).max(100),
    username: z.string().min(2).optional()
})

const user = {
    email: 'vitoremail.com',
    age: 25,
    username: 'snyted'
}


// const { success, error } = userSchema.safeParse(user)

// --- 03 ---

const cartSchema = z.object({
    clientId: z.uuid(),
    products: z.array(
        z.object({
            name: z.string().min(3),
            price: z.number().min(1),
            qnt: z.number().min(1),
            categories: z.array(z.string().min(1))
        })
    )
})

const cart = {
    clientId: crypto.randomUUID(),
    products: [
        {
            name: "Macbook",
            price: 5000,
            qnt: 1,
            categories: ["Eletronico", "Computador"]
        }
    ]
}

const cart02 = {
    clientId: crypto.randomUUID(),
    products: [
        {
            name: "Mouse",
            price: 0,
            qnt: 1,
            categories: ["Eletronico", "Computador", "Periferico"]
        }
    ]
}


// --- 04 ---

const user02Schema = z.object({
    name: z.string().min(2),
    workDays: z.array(z.string().transform(day => day.slice(0, 3).toLowerCase()))
})

const user02 = {
    name: "Er",
    workDays: ["SegunDa", "Terça", "QuaRta", "QUINTA", "SexTA"]
}

// const { success, data } = user02Schema.safeParse(user02)

//--- 05 ---

const orderSchema = z.object({
    size: z.enum(["P", "M", "G"]),
    flavor: z.string().min(3),
    extras: z.array(z.string().min(1)).optional(),
    price: z.number().optional(),
}).transform(order => {
    const basePrice = {
        "P": 20,
        "M": 30,
        "G": 40,
    }[order.size];

    const extrasPrice = (order.extras?.length || 0) * 5;

    return {
        ...order,
        price: basePrice + extrasPrice
    };
})

const order = {
    size: "G",
    flavor: "Margherita",
}

// const { success, data, error } = orderSchema.safeParse(order)
// console.log(success, data, error)

// --- 06 --- Refinamento básico 

const user06Schema = z.object({
    name: z.string().min(2),
    instagram: z.url().refine(url => url.includes('instagram.com'), { error: "A url do instagram precisa conter 'instagram.com'" }).optional()
})

const user06 = {
    name: 'Meu insta',
    instagram: 'https://www.instagram.com/eu'
}

// const {success, data, error} = user06Schema.safeParse(user06)
// console.log(data)

// --- 07 ---

const devSchema = z.object({
    name: z.string().min(5),
    email: z.email(),
    primaryProgrammingLanguage: z.string().min(2),
    level: z.enum(['junior', 'pleno', 'senior']),
    experienceInYears: z.number().min(1).max(30),
    technologies: z.array(z.string().min(1))
}).refine(dev => {
    if (dev.level === 'senior') {
        return dev.experienceInYears >= 5 && dev.technologies.length >= 2
    }

    return true
}, { error: 'Não pode ser senior' })

const seniorNaoPassou = {
    name: 'Vitor',
    email: 'vitor@gmail.com',
    primaryProgrammingLanguage: 'TypeScript',
    level: 'senior',
    experienceInYears: 3,
    technologies: ['React', 'Node.js']
}

// console.log("Não passou: ", devSchema.safeParse(seniorNaoPassou))

const seniorPassou = {
    name: 'Vitor',
    email: 'vitor@gmail.com',
    primaryProgrammingLanguage: 'TypeScript',
    level: 'senior',
    experienceInYears: 5,
    technologies: ['React', 'Node.js']
}

// console.log("Passou: ", devSchema.safeParse(seniorPassou))

const junior = {
    name: 'Vitor',
    email: 'vitor@gmail.com',
    primaryProgrammingLanguage: 'TypeScript',
    level: 'junior',
    experienceInYears: 1,
    technologies: ['React', 'Node.js']
}

// console.log("Passou: ", devSchema.safeParse(junior))

// --- 008 ---

const user07Schema = z.object({
    name: z.string().min(5),
    email: z.email(),
    password: z.string().min(6),
    age: z.string().transform(value => Number(value)),
    isAdmin: z.boolean().default(false).optional()
})

type UserType = z.infer<typeof user07Schema>

const userTest: UserType = {
    name: 'Vitor',
    email: 'vitor@gmail.com',
    age: 25,
    password: "123456"
}

type UserInputType = z.input<typeof user07Schema>
type UserOutputType = z.output<typeof user07Schema>
