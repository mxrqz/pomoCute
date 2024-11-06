import { Achievements } from "@/types/types";
import { stats } from "./statsHandle";

function achievementsList() {
    const statistics = stats()

    const pomodoroAchievements = [
        {
            id: 'firstSession',
            name: "Primeiro Passo",
            desc: "Completar 1 sessão de Pomodoro.",
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBhcnR5LXBvcHBlciI+PHBhdGggZD0iTTUuOCAxMS4zIDIgMjJsMTAuNy0zLjc5Ii8+PHBhdGggZD0iTTQgM2guMDEiLz48cGF0aCBkPSJNMjIgOGguMDEiLz48cGF0aCBkPSJNMTUgMmguMDEiLz48cGF0aCBkPSJNMjIgMjBoLjAxIi8+PHBhdGggZD0ibTIyIDItMi4yNC43NWEyLjkgMi45IDAgMCAwLTEuOTYgMy4xMmMuMS44Ni0uNTcgMS42My0xLjQ1IDEuNjNoLS4zOGMtLjg2IDAtMS42LjYtMS43NiAxLjQ0TDE0IDEwIi8+PHBhdGggZD0ibTIyIDEzLS44Mi0uMzNjLS44Ni0uMzQtMS44Mi4yLTEuOTggMS4xMWMtLjExLjctLjcyIDEuMjItMS40MyAxLjIySDE3Ii8+PHBhdGggZD0ibTExIDIgLjMzLjgyYy4zNC44Ni0uMiAxLjgyLTEuMTEgMS45OEM5LjUyIDQuOSA5IDUuNTIgOSA2LjIzVjciLz48cGF0aCBkPSJNMTEgMTNjMS45MyAxLjkzIDIuODMgNC4xNyAyIDUtLjgzLjgzLTMuMDctLjA3LTUtMi0xLjkzLTEuOTMtMi44My00LjE3LTItNSAuODMtLjgzIDMuMDcuMDcgNSAyWiIvPjwvc3ZnPg==',
            condition: statistics.totalPomodoro >= 1,
        },
        {
            id: 'pomodoroBuddy',
            name: "Parceiro de Pomodoro",
            desc: "Completar 3 sessões de Pomodoro.",
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhhbmRzaGFrZSI+PHBhdGggZD0ibTExIDE3IDIgMmExIDEgMCAxIDAgMy0zIi8+PHBhdGggZD0ibTE0IDE0IDIuNSAyLjVhMSAxIDAgMSAwIDMtM2wtMy44OC0zLjg4YTMgMyAwIDAgMC00LjI0IDBsLS44OC44OGExIDEgMCAxIDEtMy0zbDIuODEtMi44MWE1Ljc5IDUuNzkgMCAwIDEgNy4wNi0uODdsLjQ3LjI4YTIgMiAwIDAgMCAxLjQyLjI1TDIxIDQiLz48cGF0aCBkPSJtMjEgMyAxIDExaC0yIi8+PHBhdGggZD0iTTMgMyAyIDE0bDYuNSA2LjVhMSAxIDAgMSAwIDMtMyIvPjxwYXRoIGQ9Ik0zIDRoOCIvPjwvc3ZnPg==',
            condition: statistics.totalPomodoro >= 3
        },
        {
            id: 'focusExpert',
            name: "Especialista em Foco",
            desc: "Completar 5 sessões de Pomodoro em um único dia.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJyYWluIj48cGF0aCBkPSJNMTIgNWEzIDMgMCAxIDAtNS45OTcuMTI1IDQgNCAwIDAgMC0yLjUyNiA1Ljc3IDQgNCAwIDAgMCAuNTU2IDYuNTg4QTQgNCAwIDEgMCAxMiAxOFoiLz48cGF0aCBkPSJNMTIgNWEzIDMgMCAxIDEgNS45OTcuMTI1IDQgNCAwIDAgMSAyLjUyNiA1Ljc3IDQgNCAwIDAgMS0uNTU2IDYuNTg4QTQgNCAwIDEgMSAxMiAxOFoiLz48cGF0aCBkPSJNMTUgMTNhNC41IDQuNSAwIDAgMS0zLTQgNC41IDQuNSAwIDAgMS0zIDQiLz48cGF0aCBkPSJNMTcuNTk5IDYuNWEzIDMgMCAwIDAgLjM5OS0xLjM3NSIvPjxwYXRoIGQ9Ik02LjAwMyA1LjEyNUEzIDMgMCAwIDAgNi40MDEgNi41Ii8+PHBhdGggZD0iTTMuNDc3IDEwLjg5NmE0IDQgMCAwIDEgLjU4NS0uMzk2Ii8+PHBhdGggZD0iTTE5LjkzOCAxMC41YTQgNCAwIDAgMSAuNTg1LjM5NiIvPjxwYXRoIGQ9Ik02IDE4YTQgNCAwIDAgMS0xLjk2Ny0uNTE2Ii8+PHBhdGggZD0iTTE5Ljk2NyAxNy40ODRBNCA0IDAgMCAxIDE4IDE4Ii8+PC9zdmc+",
            condition: statistics.daily.length !== 0 && statistics.daily[statistics.daily.length - 1].pomodoros >= 5
        },
        {
            id: 'pomodoroChampion',
            name: "Campeão do Pomodoro",
            desc: "Completar 20 sessões de Pomodoro em uma semana.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRyb3BoeSI+PHBhdGggZD0iTTYgOUg0LjVhMi41IDIuNSAwIDAgMSAwLTVINiIvPjxwYXRoIGQ9Ik0xOCA5aDEuNWEyLjUgMi41IDAgMCAwIDAtNUgxOCIvPjxwYXRoIGQ9Ik00IDIyaDE2Ii8+PHBhdGggZD0iTTEwIDE0LjY2VjE3YzAgLjU1LS40Ny45OC0uOTcgMS4yMUM3Ljg1IDE4Ljc1IDcgMjAuMjQgNyAyMiIvPjxwYXRoIGQ9Ik0xNCAxNC42NlYxN2MwIC41NS40Ny45OC45NyAxLjIxQzE2LjE1IDE4Ljc1IDE3IDIwLjI0IDE3IDIyIi8+PHBhdGggZD0iTTE4IDJINnY3YTYgNiAwIDAgMCAxMiAwVjJaIi8+PC9zdmc+",
            condition: statistics.weekly.length !== 0 && statistics.weekly[statistics.weekly.length - 1].pomodoros >= 20
        },
        {
            id: 'monthlyMilestone',
            name: "Conquista Mensal",
            desc: "Completar 100 sessões de Pomodoro em um mês.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhbGVuZGFyIj48cGF0aCBkPSJNOCAydjQiLz48cGF0aCBkPSJNMTYgMnY0Ii8+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSI0IiByeD0iMiIvPjxwYXRoIGQ9Ik0zIDEwaDE4Ii8+PC9zdmc+",
            condition: statistics.monthly.length !== 0 && statistics.monthly[statistics.monthly.length - 1].pomodoros >= 100
        },
        {
            id: 'earlyBird',
            name: "Começando Cedo",
            desc: "Completar um Pomodoro antes das 9 da manhã.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXN1bnJpc2UiPjxwYXRoIGQ9Ik0xMiAydjgiLz48cGF0aCBkPSJtNC45MyAxMC45MyAxLjQxIDEuNDEiLz48cGF0aCBkPSJNMiAxOGgyIi8+PHBhdGggZD0iTTIwIDE4aDIiLz48cGF0aCBkPSJtMTkuMDcgMTAuOTMtMS40MSAxLjQxIi8+PHBhdGggZD0iTTIyIDIySDIiLz48cGF0aCBkPSJtOCA2IDQtNCA0IDQiLz48cGF0aCBkPSJNMTYgMThhNCA0IDAgMCAwLTggMCIvPjwvc3ZnPg==",
            condition: false,
        },
        {
            id: 'consistentWorker',
            name: "Consistência é Tudo",
            desc: "Completar pelo menos 1 Pomodoro por dia, durante 7 dias consecutivos.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRyZW5kaW5nLXVwIj48cG9seWxpbmUgcG9pbnRzPSIyMiA3IDEzLjUgMTUuNSA4LjUgMTAuNSAyIDE3Ii8+PHBvbHlsaW5lIHBvaW50cz0iMTYgNyAyMiA3IDIyIDEzIi8+PC9zdmc+",
            condition: false,
        },
        {
            id: 'powerFocus',
            name: "Foco Extremo",
            desc: "Completar 10 sessões de Pomodoro consecutivas sem pausas extras.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZsYW1lIj48cGF0aCBkPSJNOC41IDE0LjVBMi41IDIuNSAwIDAgMCAxMSAxMmMwLTEuMzgtLjUtMi0xLTMtMS4wNzItMi4xNDMtLjIyNC00LjA1NCAyLTYgLjUgMi41IDIgNC45IDQgNi41IDIgMS42IDMgMy41IDMgNS41YTcgNyAwIDEgMS0xNCAwYzAtMS4xNTMuNDMzLTIuMjk0IDEtM2EyLjUgMi41IDAgMCAwIDIuNSAyLjV6Ii8+PC9zdmc+",
            condition: false,
        },
        {
            id: 'eveningOwl',
            name: "Turno Noturno",
            desc: "Completar uma sessão de Pomodoro após as 22h.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1vb24iPjxwYXRoIGQ9Ik0xMiAzYTYgNiAwIDAgMCA5IDkgOSA5IDAgMSAxLTktOVoiLz48L3N2Zz4=",
            condition: false,
        }
    ];

    const taskAchievements = [
        {
            id: 'taskExpert',
            name: "Especialista em Tarefas",
            desc: "Marcar 10 tarefas como concluídas na lista de tarefas.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS1jaGVjay1iaWciPjxwYXRoIGQ9Ik0yMS44MDEgMTBBMTAgMTAgMCAxIDEgMTcgMy4zMzUiLz48cGF0aCBkPSJtOSAxMSAzIDNMMjIgNCIvPjwvc3ZnPg==",
            condition: statistics.completedTasksCount >= 10
        }
    ];

    const quickNotesAchievements = [
        {
            id: 'noteTaker',
            name: "Anotador",
            desc: "Fazer 5 anotações rápidas.",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBlbmNpbCI+PHBhdGggZD0iTTIxLjE3NCA2LjgxMmExIDEgMCAwIDAtMy45ODYtMy45ODdMMy44NDIgMTYuMTc0YTIgMiAwIDAgMC0uNS44M2wtMS4zMjEgNC4zNTJhLjUuNSAwIDAgMCAuNjIzLjYyMmw0LjM1My0xLjMyYTIgMiAwIDAgMCAuODMtLjQ5N3oiLz48cGF0aCBkPSJtMTUgNSA0IDQiLz48L3N2Zz4=",
            condition: statistics.quickNotes >= 5,
        }
    ];

    const achievimentsList = [
        ...pomodoroAchievements,
        ...taskAchievements,
        ...quickNotesAchievements,
        // {
        //     id: '',
        //     name: "Mestre do Lofi",
        //     desc: "Ouvir música lofi por mais de 5 horas durante as sessões de Pomodoro.",
        //     condition: (stats: Statistics) => 'sla'
        // },
        // {
        //     id: '',
        //     name: "Conquista da Persistência",
        //     desc: "Utilizar o Pomodoro por 30 dias consecutivos.",
        //     condition: (stats: Statistics) => stats.consecutiveDays >= 30
        // },
        // {
        //     id: '',
        //     name: "Desafiador",
        //     desc: "Aumentar o tempo da sessão de Pomodoro (ex.: de 25 para 30 minutos).",
        //     condition: (stats: Statistics) => 'manter o track se foi finalizado um pomodoro no "balanceado"'
        // },
    ]

    return achievimentsList
}

function getUnlockedAchievements(): Achievements[] {
    const unlockedAchievementsString = localStorage.getItem('achievements')
    const unlockedAchievements: Achievements[] = unlockedAchievementsString ? JSON.parse(unlockedAchievementsString) : []
    return unlockedAchievements
}

function checkAchievements(): string | undefined {
    const unlockedAchievements = getUnlockedAchievements()
    const list = achievementsList()

    if (list) {
        for (const achievement of list) {
            // const isUnlocked = unlockedAchievements.includes(achievement.id);
            const isUnlocked = unlockedAchievements.find(a => a.id === achievement.id)
            const currentTime = new Date()

            if (!isUnlocked && achievement.condition) {
                const newUnlockedAchievements = [...unlockedAchievements, { icon: achievement.icon, id: achievement.id, time: currentTime }];

                localStorage.setItem('achievements', JSON.stringify(newUnlockedAchievements));
                return achievement.name;
            }
        }
    }

    return undefined;
}

export { checkAchievements, achievementsList, getUnlockedAchievements }