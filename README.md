# FormAI — Formulaires administratifs intelligents

> SaaS de génération de formulaires administratifs français avec paiement Stripe, PDF automatique et lettre d'accompagnement générée par IA.

**Live demo** : [formai-flax.vercel.app](https://formai-flax.vercel.app)

## Stack technique

- **Frontend** : Next.js 14 + TypeScript + Tailwind CSS + React Hook Form + Zod
- **Backend** : NestJS + TypeORM + PostgreSQL + JWT Auth
- **Paiement** : Stripe Checkout
- **PDF** : pdf-lib (génération côté serveur)
- **IA** : OpenRouter (Claude 3 Haiku) — lettre d'accompagnement personnalisée
- **Email** : SendGrid
- **Déploiement** : Railway (backend + PostgreSQL) + Vercel (frontend)

## Fonctionnalités

- Wizard 3 étapes adapté par type de formulaire (Succession, Naturalisation, MaPrimeRénov')
- Validation Zod côté client + validation NestJS côté serveur
- Paiement sécurisé Stripe (test : `4242 4242 4242 4242`)
- Génération PDF officiel avec en-tête FormAI
- Lettre d'accompagnement générée par IA (Claude 3 Haiku via OpenRouter)
- Envoi automatique par email (SendGrid)

## Aperçu

### Accueil
![Accueil](screenshoots/1-Accueil.png)

### Inscription
![Inscription](screenshoots/02-Inscription.png)

### Connexion
![Connexion](screenshoots/03-Connexion.png)

### Dashboard
![Dashboard](screenshoots/04-Dasboard.png)

### Formulaire — Étape 1 (Informations personnelles)
![Étape 1](screenshoots/05-Info.png)

### Formulaire — Étape 2 (Succession)
![Étape 2 Succession](screenshoots/06-Form_Succesion.png)

### Formulaire — Étape 2 (Informations défunt)
![Étape 2 Défunt](screenshoots/06-Info_Defunt.png)

### Paiement Stripe
![Paiement](screenshoots/07-Payement.png)

![Paiement Suite](screenshoots/08-Payament_Suite.png)

![Paiement Suite 2](screenshoots/09-Payament_Suite2.png)

### Génération IA
![Génération IA](screenshoots/10-Géneration%20IA.png)

### Résultat lettre IA
![Résultat IA](screenshoots/11-Résultat_IA.png)

### PDF généré
![PDF](screenshoots/12-PDF.png)

---

Développé par **Bayane Miguel Singcol** · 2026
