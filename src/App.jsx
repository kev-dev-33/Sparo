import { useEffect, useState } from 'react'
import './App.css'
import logo from '../src/assets/logo.png'
import { supabase } from './supabase'

const emptyWorkout = { exercise: '', weight: '', reps: '', rpe: '' }

const getSessionTime = (date) => {
  const [day, month, year] = date.split('/').map(Number)
  return new Date(year, month - 1, day).getTime()
}
const emptyExercise = { name: '', sets: '', reps: '', intensity: '' }
const programTemplates = [
  { category: 'Débutants', name: 'Full Body', description: 'Travail complet du corps à chaque séance.' },
  { category: 'Débutants', name: 'Half Body', description: 'Séances alternées entre haut et bas du corps.' },
  { category: 'Débutants', name: 'Starting Strength', description: 'Fondamentaux de la force avec une progression linéaire.' },
  { category: 'Débutants', name: 'StrongLifts 5x5', description: 'Cinq séries de cinq répétitions sur les mouvements clés.' },
  { category: 'Débutants', name: 'Fierce 5', description: 'Programme simple et équilibré pour progresser régulièrement.' },
  { category: 'Intermédiaires', name: 'Upper/Lower Split', description: 'Répartition structurée entre haut et bas du corps.' },
  { category: 'Intermédiaires', name: 'PHUL', description: 'Deux séances de puissance et deux séances d’hypertrophie.' },
  { category: 'Intermédiaires', name: 'Arnold Split', description: 'Pectoraux/dos, épaules et bras, puis jambes.' },
  { category: 'Intermédiaires', name: 'Powerbuilding', description: 'Combinaison de force maximale et de développement musculaire.' },
  { category: 'Intermédiaires', name: 'GZCLP', description: 'Progression linéaire combinant force et volume.' },
  { category: 'Avancés', name: 'Push Pull Legs', description: 'Poussée, tirage et jambes en rotation.' },
  { category: 'Avancés', name: 'Bro Split', description: 'Un groupe musculaire ciblé par séance.' },
  { category: 'Avancés', name: 'FST-7', description: 'Séries de finition pour maximiser le volume musculaire.' },
  { category: 'Avancés', name: 'PHAT', description: 'Alternance entre puissance et hypertrophie.' },
  { category: 'Avancés', name: 'DoggCrapp', description: 'Entraînement intense avec progression et récupération ciblées.' },
  { category: 'Avancés', name: 'German Volume Training', description: 'Volume élevé avec dix séries de dix répétitions.' },
  { category: 'Force pure', name: '5/3/1 Wendler', description: 'Cycles de force progressifs basés sur les mouvements clés.' },
  { category: 'Force pure', name: 'Cube Method', description: 'Rotation de séances de force, vitesse et répétitions.' },
  { category: 'Force pure', name: 'Sheiko', description: 'Plan de force à haut volume et grande fréquence technique.' },
  { category: 'Force pure', name: 'Smolov', description: 'Cycle exigeant centré sur la progression du squat.' },
  { category: 'Force pure', name: 'Conjugate Method', description: 'Travail alterné de force maximale, vitesse et effort dynamique.' },
  { category: 'Hybrides', name: 'Daily Undulating Periodization', description: 'Intensité et volume varient à chaque séance.' },
  { category: 'Hybrides', name: 'Block Periodization', description: 'Cycles successifs dédiés au volume, à la force et au pic.' },
  { category: 'Hybrides', name: 'EMOM', description: 'Un effort programmé au début de chaque minute.' },
  { category: 'Hybrides', name: 'Powerbuilding hybride', description: 'Force et hypertrophie combinées dans une même structure.' },
]
const programDetails = {
  'Full Body': {
    principe: "Travail complet du corps à chaque séance pour maximiser la fréquence de stimulation sur chaque groupe musculaire, idéal pour les débutants.",
    duree_programme_semaines: 8,
    seances_par_semaine: 3,
    duree_seance_minutes: "45-60",
    echauffement: "5-10 min de cardio léger (vélo, rameur) puis 2 séries légères de l'exercice principal avant de monter en charge.",
    etirements: "5-10 min d'étirements légers en fin de séance, focus sur les groupes travaillés.",
    repos_entre_series_secondes: 90,
    jours: [
      { nom: "Séance A", exercices: [
        { nom: "Squat", series: 3, repetitions: "8-10", charge: "Progressive, RPE 6-7", repos_secondes: 90 },
        { nom: "Développé couché", series: 3, repetitions: "8-10", charge: "Progressive, RPE 6-7", repos_secondes: 90 },
        { nom: "Rowing barre", series: 3, repetitions: "8-10", charge: "Progressive, RPE 6-7", repos_secondes: 90 },
        { nom: "Développé militaire", series: 2, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 },
        { nom: "Gainage planche", series: 3, repetitions: "30-45s", charge: "Poids du corps", repos_secondes: 45 }
      ]},
      { nom: "Séance B", exercices: [
        { nom: "Soulevé de terre", series: 3, repetitions: "6-8", charge: "Progressive, RPE 6-7", repos_secondes: 120 },
        { nom: "Développé incliné haltères", series: 3, repetitions: "8-10", charge: "Progressive, RPE 6-7", repos_secondes: 90 },
        { nom: "Tirage vertical", series: 3, repetitions: "10-12", charge: "Progressive, RPE 6-7", repos_secondes: 90 },
        { nom: "Fentes marchées", series: 2, repetitions: "10-12 par jambe", charge: "Modérée", repos_secondes: 60 },
        { nom: "Gainage latéral", series: 3, repetitions: "30s par côté", charge: "Poids du corps", repos_secondes: 45 }
      ]}
    ]
  },
  'Half Body': {
    principe: "Alternance entre haut et bas du corps pour permettre plus de volume par groupe musculaire tout en restant simple à suivre.",
    duree_programme_semaines: 8,
    seances_par_semaine: 4,
    duree_seance_minutes: "45-55",
    echauffement: "5 min cardio léger + 2 séries d'échauffement progressif sur le premier exercice de la séance.",
    etirements: "5-10 min d'étirements ciblés sur les groupes travaillés du jour.",
    repos_entre_series_secondes: 90,
    jours: [
      { nom: "Jour 1 - Haut du corps", exercices: [
        { nom: "Développé couché", series: 4, repetitions: "8-10", charge: "Progressive, RPE 7", repos_secondes: 90 },
        { nom: "Rowing haltère", series: 4, repetitions: "8-10", charge: "Progressive, RPE 7", repos_secondes: 90 },
        { nom: "Développé militaire", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 75 },
        { nom: "Curl biceps", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 }
      ]},
      { nom: "Jour 2 - Bas du corps", exercices: [
        { nom: "Squat", series: 4, repetitions: "8-10", charge: "Progressive, RPE 7", repos_secondes: 120 },
        { nom: "Soulevé de terre roumain", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 90 },
        { nom: "Presse à cuisses", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 90 },
        { nom: "Mollets debout", series: 3, repetitions: "12-15", charge: "Modérée", repos_secondes: 60 }
      ]}
    ]
  },
  'Starting Strength': {
    principe: "Programme de force basé sur la progression linéaire : on ajoute du poids à chaque séance sur les mouvements de base.",
    duree_programme_semaines: 12,
    seances_par_semaine: 3,
    duree_seance_minutes: "45-60",
    echauffement: "Montée progressive en charge sur chaque exercice principal (5 paliers avant le poids de travail).",
    etirements: "5 min d'étirements légers en fin de séance, optionnel.",
    repos_entre_series_secondes: 180,
    jours: [
      { nom: "Séance A", exercices: [
        { nom: "Squat", series: 3, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 180 },
        { nom: "Développé couché", series: 3, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 180 },
        { nom: "Soulevé de terre", series: 1, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 180 }
      ]},
      { nom: "Séance B", exercices: [
        { nom: "Squat", series: 3, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 180 },
        { nom: "Développé militaire", series: 3, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 180 },
        { nom: "Rowing barre", series: 3, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 180 }
      ]}
    ]
  },
  'StrongLifts 5x5': {
    principe: "Cinq séries de cinq répétitions sur les mouvements composés majeurs, progression linéaire simple, alternance A/B.",
    duree_programme_semaines: 12,
    seances_par_semaine: 3,
    duree_seance_minutes: "45-60",
    echauffement: "2-3 séries légères progressives avant chaque exercice principal.",
    etirements: "5 min d'étirements légers en fin de séance, optionnel.",
    repos_entre_series_secondes: 150,
    jours: [
      { nom: "Séance A", exercices: [
        { nom: "Squat", series: 5, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 150 },
        { nom: "Développé couché", series: 5, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 150 },
        { nom: "Rowing barre", series: 5, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 150 }
      ]},
      { nom: "Séance B", exercices: [
        { nom: "Squat", series: 5, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 150 },
        { nom: "Développé militaire", series: 5, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 150 },
        { nom: "Soulevé de terre", series: 1, repetitions: "5", charge: "+2.5kg par séance", repos_secondes: 180 }
      ]}
    ]
  },
  'Fierce 5': {
    principe: "Programme simple et équilibré en 3 exercices par séance pour progresser régulièrement sans complexité excessive.",
    duree_programme_semaines: 10,
    seances_par_semaine: 3,
    duree_seance_minutes: "40-50",
    echauffement: "2 séries légères progressives avant chaque exercice.",
    etirements: "5 min d'étirements légers en fin de séance, optionnel.",
    repos_entre_series_secondes: 120,
    jours: [
      { nom: "Séance A", exercices: [
        { nom: "Squat", series: 5, repetitions: "5", charge: "Progressive, RPE 7-8", repos_secondes: 120 },
        { nom: "Développé couché", series: 5, repetitions: "5", charge: "Progressive, RPE 7-8", repos_secondes: 120 },
        { nom: "Rowing barre", series: 5, repetitions: "5", charge: "Progressive, RPE 7-8", repos_secondes: 120 }
      ]},
      { nom: "Séance B", exercices: [
        { nom: "Soulevé de terre", series: 5, repetitions: "5", charge: "Progressive, RPE 7-8", repos_secondes: 150 },
        { nom: "Développé militaire", series: 5, repetitions: "5", charge: "Progressive, RPE 7-8", repos_secondes: 120 },
        { nom: "Tirage vertical", series: 5, repetitions: "5", charge: "Progressive, RPE 7-8", repos_secondes: 120 }
      ]}
    ]
  }
  ,
  'Upper/Lower Split': {
    principe: "Répartition structurée entre haut et bas du corps, 4 séances par semaine pour un bon équilibre volume/récupération.",
    duree_programme_semaines: 10,
    seances_par_semaine: 4,
    duree_seance_minutes: "60-75",
    echauffement: "5-10 min cardio léger + 2-3 séries progressives sur le premier exercice lourd.",
    etirements: "10 min d'étirements ciblés sur les groupes travaillés en fin de séance.",
    repos_entre_series_secondes: 90,
    jours: [
      { nom: "Jour 1 - Haut (Force)", exercices: [
        { nom: "Développé couché", series: 4, repetitions: "6-8", charge: "Progressive, RPE 8", repos_secondes: 120 },
        { nom: "Rowing barre", series: 4, repetitions: "6-8", charge: "Progressive, RPE 8", repos_secondes: 120 },
        { nom: "Développé militaire", series: 3, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 90 },
        { nom: "Tirage vertical", series: 3, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 90 }
      ]},
      { nom: "Jour 2 - Bas (Force)", exercices: [
        { nom: "Squat", series: 4, repetitions: "6-8", charge: "Progressive, RPE 8", repos_secondes: 150 },
        { nom: "Soulevé de terre roumain", series: 3, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 120 },
        { nom: "Presse à cuisses", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 90 },
        { nom: "Mollets debout", series: 4, repetitions: "12-15", charge: "Modérée", repos_secondes: 60 }
      ]},
      { nom: "Jour 3 - Haut (Volume)", exercices: [
        { nom: "Développé incliné haltères", series: 4, repetitions: "10-12", charge: "Modérée", repos_secondes: 75 },
        { nom: "Rowing haltère", series: 4, repetitions: "10-12", charge: "Modérée", repos_secondes: 75 },
        { nom: "Élévations latérales", series: 3, repetitions: "12-15", charge: "Légère-modérée", repos_secondes: 60 },
        { nom: "Curl biceps", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 },
        { nom: "Extension triceps", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 }
      ]},
      { nom: "Jour 4 - Bas (Volume)", exercices: [
        { nom: "Fentes bulgares", series: 3, repetitions: "10-12 par jambe", charge: "Modérée", repos_secondes: 75 },
        { nom: "Leg curl", series: 3, repetitions: "12-15", charge: "Modérée", repos_secondes: 60 },
        { nom: "Hip thrust", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 75 },
        { nom: "Mollets assis", series: 3, repetitions: "15-20", charge: "Légère-modérée", repos_secondes: 45 }
      ]}
    ]
  },
  'PHUL': {
    principe: "Power Hypertrophy Upper Lower : deux séances de force et deux séances d'hypertrophie par semaine, alternant haut et bas du corps.",
    duree_programme_semaines: 10,
    seances_par_semaine: 4,
    duree_seance_minutes: "60-75",
    echauffement: "5-10 min cardio léger + montée progressive sur l'exercice principal.",
    etirements: "10 min d'étirements en fin de séance.",
    repos_entre_series_secondes: 120,
    jours: [
      { nom: "Jour 1 - Haut (Puissance)", exercices: [
        { nom: "Développé couché", series: 4, repetitions: "3-5", charge: "Lourde, RPE 8-9", repos_secondes: 150 },
        { nom: "Rowing barre", series: 4, repetitions: "3-5", charge: "Lourde, RPE 8-9", repos_secondes: 150 },
        { nom: "Développé militaire", series: 3, repetitions: "5-8", charge: "Modérée-lourde", repos_secondes: 120 },
        { nom: "Tirage horizontal", series: 3, repetitions: "5-8", charge: "Modérée-lourde", repos_secondes: 120 }
      ]},
      { nom: "Jour 2 - Bas (Puissance)", exercices: [
        { nom: "Squat", series: 4, repetitions: "3-5", charge: "Lourde, RPE 8-9", repos_secondes: 180 },
        { nom: "Soulevé de terre", series: 3, repetitions: "3-5", charge: "Lourde, RPE 8-9", repos_secondes: 180 },
        { nom: "Presse à cuisses", series: 3, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 120 },
        { nom: "Mollets debout", series: 4, repetitions: "6-10", charge: "Lourde", repos_secondes: 90 }
      ]},
      { nom: "Jour 3 - Haut (Hypertrophie)", exercices: [
        { nom: "Développé incliné haltères", series: 4, repetitions: "8-12", charge: "Modérée", repos_secondes: 75 },
        { nom: "Rowing haltère", series: 4, repetitions: "8-12", charge: "Modérée", repos_secondes: 75 },
        { nom: "Élévations latérales", series: 3, repetitions: "10-15", charge: "Légère", repos_secondes: 60 },
        { nom: "Curl biceps", series: 3, repetitions: "8-12", charge: "Modérée", repos_secondes: 60 },
        { nom: "Extension triceps", series: 3, repetitions: "8-12", charge: "Modérée", repos_secondes: 60 }
      ]},
      { nom: "Jour 4 - Bas (Hypertrophie)", exercices: [
        { nom: "Fentes marchées", series: 3, repetitions: "10-15 par jambe", charge: "Modérée", repos_secondes: 75 },
        { nom: "Leg extension", series: 3, repetitions: "12-15", charge: "Modérée", repos_secondes: 60 },
        { nom: "Leg curl", series: 3, repetitions: "12-15", charge: "Modérée", repos_secondes: 60 },
        { nom: "Mollets assis", series: 4, repetitions: "12-20", charge: "Modérée", repos_secondes: 45 }
      ]}
    ]
  },
  'Arnold Split': {
    principe: "Split classique en 5 jours : pectoraux/dos, épaules/bras, jambes, puis répétition avec un jour de repos — inspiré du split d'Arnold Schwarzenegger.",
    duree_programme_semaines: 10,
    seances_par_semaine: 5,
    duree_seance_minutes: "60-75",
    echauffement: "5-10 min cardio léger + 2 séries progressives sur le premier exercice.",
    etirements: "10 min d'étirements ciblés en fin de séance.",
    repos_entre_series_secondes: 75,
    jours: [
      { nom: "Jour 1 - Pectoraux / Dos", exercices: [
        { nom: "Développé couché", series: 4, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 90 },
        { nom: "Tirage vertical", series: 4, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 90 },
        { nom: "Développé incliné haltères", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 75 },
        { nom: "Rowing barre", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 75 }
      ]},
      { nom: "Jour 2 - Épaules / Bras", exercices: [
        { nom: "Développé militaire", series: 4, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 90 },
        { nom: "Élévations latérales", series: 3, repetitions: "12-15", charge: "Légère", repos_secondes: 60 },
        { nom: "Curl biceps", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 },
        { nom: "Extension triceps", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 }
      ]},
      { nom: "Jour 3 - Jambes", exercices: [
        { nom: "Squat", series: 4, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 120 },
        { nom: "Presse à cuisses", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 90 },
        { nom: "Leg curl", series: 3, repetitions: "12-15", charge: "Modérée", repos_secondes: 75 },
        { nom: "Mollets debout", series: 4, repetitions: "12-15", charge: "Modérée", repos_secondes: 60 }
      ]},
      { nom: "Jour 4 - Pectoraux / Dos (variante)", exercices: [
        { nom: "Développé décliné", series: 4, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 90 },
        { nom: "Rowing haltère", series: 4, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 90 },
        { nom: "Écarté couché", series: 3, repetitions: "12-15", charge: "Légère-modérée", repos_secondes: 60 }
      ]},
      { nom: "Jour 5 - Épaules / Bras (variante)", exercices: [
        { nom: "Développé Arnold", series: 4, repetitions: "8-10", charge: "Modérée", repos_secondes: 90 },
        { nom: "Curl marteau", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 },
        { nom: "Dips triceps", series: 3, repetitions: "10-12", charge: "Poids du corps", repos_secondes: 60 }
      ]}
    ]
  },
  'Powerbuilding': {
    principe: "Combinaison de force maximale sur les mouvements de base et de volume d'hypertrophie pour développer force et muscle en parallèle.",
    duree_programme_semaines: 12,
    seances_par_semaine: 4,
    duree_seance_minutes: "70-85",
    echauffement: "10 min cardio léger + montée progressive complète sur l'exercice principal.",
    etirements: "10 min d'étirements en fin de séance.",
    repos_entre_series_secondes: 120,
    jours: [
      { nom: "Jour 1 - Squat (Force + Volume)", exercices: [
        { nom: "Squat", series: 5, repetitions: "5", charge: "Lourde, RPE 8", repos_secondes: 180 },
        { nom: "Presse à cuisses", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 90 },
        { nom: "Fentes marchées", series: 3, repetitions: "10-12 par jambe", charge: "Modérée", repos_secondes: 75 }
      ]},
      { nom: "Jour 2 - Bench (Force + Volume)", exercices: [
        { nom: "Développé couché", series: 5, repetitions: "5", charge: "Lourde, RPE 8", repos_secondes: 180 },
        { nom: "Développé incliné haltères", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 90 },
        { nom: "Écarté couché", series: 3, repetitions: "12-15", charge: "Légère-modérée", repos_secondes: 60 }
      ]},
      { nom: "Jour 3 - Deadlift (Force + Volume)", exercices: [
        { nom: "Soulevé de terre", series: 5, repetitions: "5", charge: "Lourde, RPE 8", repos_secondes: 180 },
        { nom: "Rowing barre", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 90 },
        { nom: "Tirage vertical", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 75 }
      ]},
      { nom: "Jour 4 - Accessoires", exercices: [
        { nom: "Développé militaire", series: 4, repetitions: "8-10", charge: "Modérée-lourde", repos_secondes: 90 },
        { nom: "Curl biceps", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 },
        { nom: "Extension triceps", series: 3, repetitions: "10-12", charge: "Modérée", repos_secondes: 60 },
        { nom: "Mollets debout", series: 4, repetitions: "12-15", charge: "Modérée", repos_secondes: 60 }
      ]}
    ]
  },
  'GZCLP': {
    principe: "Progression linéaire combinant force (T1), volume (T2) et endurance musculaire (T3) sur chaque mouvement principal.",
    duree_programme_semaines: 12,
    seances_par_semaine: 4,
    duree_seance_minutes: "60-75",
    echauffement: "Montée progressive en charge avant le mouvement T1.",
    etirements: "5-10 min d'étirements légers en fin de séance.",
    repos_entre_series_secondes: 120,
    jours: [
      { nom: "Jour 1 - Squat T1 / Bench T2", exercices: [
        { nom: "Squat", series: 5, repetitions: "3", charge: "Progressive, T1", repos_secondes: 150 },
        { nom: "Développé couché", series: 3, repetitions: "10", charge: "Modérée, T2", repos_secondes: 90 },
        { nom: "Tirage horizontal", series: 3, repetitions: "15", charge: "Légère-modérée, T3", repos_secondes: 60 }
      ]},
      { nom: "Jour 2 - Bench T1 / Deadlift T2", exercices: [
        { nom: "Développé couché", series: 5, repetitions: "3", charge: "Progressive, T1", repos_secondes: 150 },
        { nom: "Soulevé de terre", series: 3, repetitions: "10", charge: "Modérée, T2", repos_secondes: 90 },
        { nom: "Curl biceps", series: 3, repetitions: "15", charge: "Légère-modérée, T3", repos_secondes: 60 }
      ]},
      { nom: "Jour 3 - Deadlift T1 / Squat T2", exercices: [
        { nom: "Soulevé de terre", series: 5, repetitions: "3", charge: "Progressive, T1", repos_secondes: 180 },
        { nom: "Squat", series: 3, repetitions: "10", charge: "Modérée, T2", repos_secondes: 120 },
        { nom: "Gainage planche", series: 3, repetitions: "45-60s", charge: "Poids du corps, T3", repos_secondes: 45 }
      ]},
      { nom: "Jour 4 - Développé militaire T1 / Rowing T2", exercices: [
        { nom: "Développé militaire", series: 5, repetitions: "3", charge: "Progressive, T1", repos_secondes: 120 },
        { nom: "Rowing barre", series: 3, repetitions: "10", charge: "Modérée, T2", repos_secondes: 90 },
        { nom: "Extension triceps", series: 3, repetitions: "15", charge: "Légère-modérée, T3", repos_secondes: 60 }
      ]}
    ]
  }
}
function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    setSubmitting(false)
    if (result.error) {
      setError(result.error.message)
      return
    }

    if (mode === 'register' && !result.data.session) {
      setMessage('Compte créé. Vérifiez votre email pour confirmer votre inscription.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <img src={logo} alt="Sparo" height="72" />
        <p className="eyebrow">ESPACE COACH</p>
        <h1>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>
        <p className="auth-description">{mode === 'login' ? 'Accédez à votre suivi sportif.' : 'Commencez à suivre vos clients.'}</p>
        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="auth-email">Email</label>
          <input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="auth-password">Mot de passe</label>
          <div className="password-input-wrap">
            <input id="auth-password" minLength="6" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </button>
          </div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-message" role="status">{message}</p>}
          <button className="btn btn-primary" disabled={submitting} type="submit">{submitting ? 'Patientez...' : mode === 'login' ? 'Se connecter' : 'S’inscrire'}</button>
        </form>
        <button className="auth-switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage('') }} type="button">
          {mode === 'login' ? 'Créer un compte' : 'J’ai déjà un compte'}
        </button>
      </section>
    </main>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [programs, setPrograms] = useState([])
  const [newClientName, setNewClientName] = useState('')
  const [newClientGoal, setNewClientGoal] = useState('')
  const [newProgramName, setNewProgramName] = useState('')
  const [newExercise, setNewExercise] = useState(emptyExercise)
  const [activeProgramId, setActiveProgramId] = useState(null)
  const [expandedDetails, setExpandedDetails] = useState({})
  const [duplicateTargets, setDuplicateTargets] = useState({})
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [newWorkout, setNewWorkout] = useState(emptyWorkout)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user?.id) {
      setClients([])
      setWorkouts([])
      setPrograms([])
      setSelectedClientId(null)
      return
    }

    const loadData = async () => {
      const userId = session.user.id
      const [{ data: clientData, error: clientsError }, { data: workoutData, error: workoutsError }, { data: programData, error: programsError }] = await Promise.all([
        supabase.from('clients').select('*').eq('user_id', userId).order('id'),
        supabase.from('workouts').select('*').eq('user_id', userId).order('id', { ascending: false }),
        supabase.from('programs').select('*').eq('user_id', userId).order('id'),
      ])

      if (clientsError || workoutsError || programsError) {
        console.error('Impossible de charger les données du coach.', clientsError || workoutsError || programsError)
        return
      }

      const loadedClients = clientData || []
      setClients(loadedClients)
      setWorkouts((workoutData || []).map(({ client_id: clientId, ...workout }) => ({ ...workout, clientId })))
      setPrograms((programData || []).map(({ client_id: clientId, ...program }) => ({ ...program, clientId, exercises: program.exercises || [] })))
      setSelectedClientId(loadedClients[0]?.id || null)
    }

    loadData()
  }, [session])

  if (authLoading) return <main className="auth-page"><p>Chargement...</p></main>
  if (!session) return <AuthPage />

  const userId = session.user.id

  const clientWorkouts = workouts.filter(({ clientId }) => clientId === selectedClientId)
  const selectedClient = clients.find(({ id }) => id === selectedClientId)
  const clientProgress = clients.map((client) => {
    const clientSessions = workouts.filter(({ clientId }) => clientId === client.id)
    const exercises = [...new Set(clientSessions.map(({ exercise }) => exercise))]
    const isProgressing = exercises.some((exercise) => {
      const sessions = clientSessions
        .filter(({ exercise: sessionExercise }) => sessionExercise === exercise)
        .sort((first, second) => getSessionTime(second.date) - getSessionTime(first.date))
      return sessions.length >= 2 && Number(sessions[0].weight) > Number(sessions[1].weight)
    })

    return { ...client, sessionCount: clientSessions.length, isProgressing }
  })

  const exerciseStats = Object.values(
    clientWorkouts.reduce((stats, workout) => {
      const current = stats[workout.exercise] || { exercise: workout.exercise, weights: [], oneRepMaxes: [], sessions: 0 }
      const weight = Number(workout.weight)
      const reps = Number(workout.reps)
      current.weights.push(weight)
      current.oneRepMaxes.push(weight * (1 + reps / 30))
      current.sessions += 1
      stats[workout.exercise] = current
      return stats
    }, {}),
  ).map(({ exercise, weights, oneRepMaxes, sessions }) => ({
    exercise,
    sessions,
    min: Math.min(...weights),
    max: Math.max(...weights),
    avg: weights.reduce((sum, weight) => sum + weight, 0) / weights.length,
    oneRepMax: Math.max(...oneRepMaxes),
  }))

  const updateWorkout = (field, value) => {
    setNewWorkout((current) => ({ ...current, [field]: value }))
  }

  const addClient = async (event) => {
    event.preventDefault()
    const name = newClientName.trim()
    if (!name) return

    const { data: client, error } = await supabase.from('clients').insert({ user_id: userId, name, goal: newClientGoal.trim() }).select().single()
    if (error) {
      console.error('Impossible d’ajouter le client.', error)
      return
    }

    setClients((current) => [...current, client])
    setSelectedClientId(client.id)
    setNewClientName('')
    setNewClientGoal('')
  }

  const removeClient = async (clientId) => {
    const remainingClients = clients.filter(({ id }) => id !== clientId)
    const [{ error: workoutsError }, { error: programsError }, { error: clientError }] = await Promise.all([
      supabase.from('workouts').delete().eq('user_id', userId).eq('client_id', clientId),
      supabase.from('programs').delete().eq('user_id', userId).eq('client_id', clientId),
      supabase.from('clients').delete().eq('user_id', userId).eq('id', clientId),
    ])
    if (workoutsError || programsError || clientError) {
      console.error('Impossible de supprimer le client.', workoutsError || programsError || clientError)
      return
    }

    setClients(remainingClients)
    setWorkouts((current) => current.filter(({ clientId: workoutClientId }) => workoutClientId !== clientId))
    setPrograms((current) => current.filter(({ clientId: programClientId }) => programClientId !== clientId))
    if (selectedClientId === clientId) setSelectedClientId(remainingClients[0]?.id || null)
  }

  const createProgram = async (event) => {
  event.preventDefault()
  const name = newProgramName.trim()
  if (!selectedClientId || !name) return

  const details = programDetails[name] || null

  const { data: savedProgram, error } = await supabase.from('programs').insert({ user_id: userId, client_id: selectedClientId, name, details }).select().single()
  if (error) {
    console.error('Impossible de créer le programme.', error)
    return
  }

  const program = { ...savedProgram, clientId: savedProgram.client_id, exercises: savedProgram.exercises || [] }
  setPrograms((current) => [...current, program])
  setActiveProgramId(program.id)
  setNewProgramName('')
}

  const updateExercise = (field, value) => {
    setNewExercise((current) => ({ ...current, [field]: value }))
  }

  const addExerciseToProgram = async (event) => {
    event.preventDefault()
    if (!activeProgramId || !newExercise.name.trim() || !newExercise.sets || !newExercise.reps) return

    const program = programs.find(({ id }) => id === activeProgramId)
    const exercises = [...program.exercises, { id: Date.now(), name: newExercise.name.trim(), sets: Number(newExercise.sets), reps: Number(newExercise.reps), intensity: newExercise.intensity.trim() }]
    const { error } = await supabase.from('programs').update({ exercises }).eq('user_id', userId).eq('id', activeProgramId)
    if (error) {
      console.error('Impossible d’ajouter l’exercice.', error)
      return
    }

    setPrograms((current) => current.map((program) => (
      program.id === activeProgramId
        ? {
            ...program,
            exercises,
          }
        : program
    )))
    setNewExercise(emptyExercise)
  }

  const removeExerciseFromProgram = async (programId, exerciseId) => {
    const program = programs.find(({ id }) => id === programId)
    const exercises = program.exercises.filter(({ id }) => id !== exerciseId)
    const { error } = await supabase.from('programs').update({ exercises }).eq('user_id', userId).eq('id', programId)
    if (error) {
      console.error('Impossible de supprimer l’exercice.', error)
      return
    }

    setPrograms((current) => current.map((program) => (
      program.id === programId
        ? { ...program, exercises }
        : program
    )))
  }

  const duplicateProgram = async (program) => {
    const targetClientId = Number(duplicateTargets[program.id])
    if (!targetClientId) return

    const { data: savedProgram, error } = await supabase.from('programs').insert({ user_id: userId, client_id: targetClientId, name: `${program.name} (copie)`, exercises: program.exercises.map((exercise) => ({ ...exercise, id: Date.now() + exercise.id })) }).select().single()
    if (error) {
      console.error('Impossible de dupliquer le programme.', error)
      return
    }

    setPrograms((current) => [...current, { ...savedProgram, clientId: savedProgram.client_id, exercises: savedProgram.exercises || [] }])
  }

  const addWorkout = async (event) => {
    event.preventDefault()
    if (!selectedClientId || !newWorkout.exercise.trim() || !newWorkout.weight || !newWorkout.reps) return

    const { data: savedWorkout, error } = await supabase.from('workouts').insert({ user_id: userId, client_id: selectedClientId, exercise: newWorkout.exercise.trim(), weight: Number(newWorkout.weight), reps: Number(newWorkout.reps), rpe: newWorkout.rpe ? Number(newWorkout.rpe) : null, date: new Date().toLocaleDateString('fr-FR') }).select().single()
    if (error) {
      console.error('Impossible d’enregistrer la séance.', error)
      return
    }

    setWorkouts((current) => [{ ...savedWorkout, clientId: savedWorkout.client_id }, ...current])
    setNewWorkout(emptyWorkout)
  }

  const removeWorkout = async (workoutId) => {
    const { error } = await supabase.from('workouts').delete().eq('user_id', userId).eq('id', workoutId)
    if (error) {
      console.error('Impossible de supprimer la séance.', error)
      return
    }

    setWorkouts((current) => current.filter(({ id }) => id !== workoutId))
  }

  const exportClientPdf = () => {
    window.print()
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Impossible de se déconnecter.', error)
  }

  return (
    <div className="app">
      <header className="header" style={{ background: '#fff', borderBottom: '4px solid #FF0000', color: '#1a1a1a' }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <img src={logo} alt="" height="80" />
          <h1 style={{ color: '#FF0000', fontWeight: 700, margin: 0 }}>SPARO</h1>
          <img src={logo} alt="" height="80" />
        </div>
        <div className="header-account">
          <span>{session.user.email}</span>
          <button className="btn btn-outline" onClick={signOut} type="button">Se déconnecter</button>
        </div>
      </header>

      <section className="dashboard section">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">VUE D'ENSEMBLE</p>
            <h2>Tableau de bord</h2>
          </div>
          <p className="muted">Suivi des performances récentes</p>
        </div>
        <div className="dashboard-summary">
          <div className="summary-card">
            <span>Clients actifs</span>
            <strong>{clients.length}</strong>
          </div>
          <div className="summary-card">
            <span>Séances enregistrées</span>
            <strong>{workouts.length}</strong>
          </div>
        </div>
        <div className="progress-table-wrap">
          <h3>Progression des clients</h3>
          <table className="progress-table">
            <thead>
              <tr><th>Client</th><th>Statut</th></tr>
            </thead>
            <tbody>
              {clientProgress.map((client) => (
  <tr key={client.id}>
    <td>{client.name}</td>
    <td
      className={
        client.sessionCount < 2
          ? 'beginner'
          : client.isProgressing
          ? 'progressing'
          : 'stagnating'
      }
      style={client.sessionCount < 2 ? { color: '#3b82f6' } : undefined}
    >
      <span aria-hidden="true">
        {client.sessionCount < 2
          ? '⭐'
          : client.isProgressing
          ? '↑'
          : '↓'}
      </span>{' '}
      {client.sessionCount < 2
        ? 'Débutant'
        : client.isProgressing
        ? 'Progression'
        : 'Stagnation'}
    </td>
  </tr>
))}
              {!clientProgress.length && <tr><td colSpan="2" className="empty">Aucun client à suivre.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <main className="container">
        <aside className="section">
          <h2>Clients</h2>
          <form className="input-group" onSubmit={addClient}>
            <input
              aria-label="Nom du nouveau client"
              value={newClientName}
              onChange={(event) => setNewClientName(event.target.value)}
              placeholder="Nom du client"
            />
            <input
              aria-label="Objectif du client"
              value={newClientGoal}
              onChange={(event) => setNewClientGoal(event.target.value)}
              placeholder="Objectif (facultatif)"
            />
            <button className="btn btn-primary" type="submit">Ajouter</button>
          </form>

          <div className="clients-list">
            {clients.map((client) => (
              <div
                className={`client-card ${client.id === selectedClientId ? 'active' : ''}`}
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                onKeyDown={(event) => event.key === 'Enter' && setSelectedClientId(client.id)}
                role="button"
                tabIndex="0"
              >
                <strong>{client.name}</strong>
                <span>{workouts.filter(({ clientId }) => clientId === client.id).length} séance(s)</span>
                <button
                  aria-label={`Supprimer ${client.name}`}
                  className="delete-button"
                  onClick={(event) => { event.stopPropagation(); removeClient(client.id) }}
                  type="button"
                >×</button>
              </div>
            ))}
            {!clients.length && <p className="empty">Ajoutez votre premier client.</p>}
          </div>

          <div className="programs-block">
            <div className="section-heading compact-heading">
              <h3>Programmes</h3>
              <span className="muted">{programs.filter(({ clientId }) => clientId === selectedClientId).length}</span>
            </div>
            {selectedClient ? (
              <>
                <div className="program-templates">
                  <p className="template-label">Choisir un modèle</p>
                  {['Débutants', 'Intermédiaires', 'Avancés', 'Force pure', 'Hybrides'].map((category) => (
                    <div className="template-category" key={category}>
                      <h4>{category}</h4>
                      <div className="template-grid">
                        {programTemplates.filter((template) => template.category === category).map((template) => (
                          <button className="template-card" key={template.name} onClick={() => setNewProgramName(template.name)} type="button">
                            <strong>{template.name}</strong>
                            <span>{template.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <form className="program-create-form" onSubmit={createProgram}>
                  <input aria-label="Nom du programme" placeholder="Nom du programme" value={newProgramName} onChange={(event) => setNewProgramName(event.target.value)} />
                  <button className="btn btn-primary" type="submit">Créer</button>
                </form>
                <div className="program-list">
                  {programs.filter(({ clientId }) => clientId === selectedClientId).map((program) => (
                    <article className={`program-card ${activeProgramId === program.id ? 'active' : ''}`} key={program.id}>
  <button className="program-name" onClick={() => setActiveProgramId(activeProgramId === program.id ? null : program.id)} type="button">
    <strong>{program.name}</strong>
    {activeProgramId === program.id && <span className="program-active-badge">✓ Actif</span>}
  </button>
  <span className="program-exercise-count">{(program.exercises || []).length} exercice(s)</span>

  {program.details && (
    <div className="program-details">
      <button
        type="button"
        className="program-details-toggle"
        onClick={() => setExpandedDetails((current) => ({ ...current, [program.id]: !current[program.id] }))}
      >
        <span>{expandedDetails[program.id] ? '▲ Réduire le détail' : '▼ Voir le détail du programme'}</span>
      </button>
      {expandedDetails[program.id] && (
        <>
          <p className="program-principle">{program.details.principe}</p>
          <p className="program-meta">
            {program.details.duree_programme_semaines} semaines · {program.details.seances_par_semaine}x/semaine · {program.details.duree_seance_minutes} min/séance
          </p>
          <p className="program-meta"><strong>Échauffement :</strong> {program.details.echauffement}</p>
          <p className="program-meta"><strong>Étirements :</strong> {program.details.etirements}</p>
          {program.details.jours.map((jour, index) => (
            <div key={index} className="program-day">
              <h4>{jour.nom}</h4>
              <ul>
                {jour.exercices.map((exercice, i) => (
                  <li key={i}>
                    <strong>{exercice.nom}</strong> — {exercice.series} x {exercice.repetitions} ({exercice.charge}), repos {exercice.repos_secondes}s
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  )}

  <form className="exercise-form" onSubmit={addExerciseToProgram}>
    <input aria-label="Nom de l'exercice" placeholder="Exercice" value={newExercise.name} onChange={(event) => updateExercise('name', event.target.value)} />
    <input aria-label="Nombre de séries" min="1" placeholder="Séries" type="number" value={newExercise.sets} onChange={(event) => updateExercise('sets', event.target.value)} />
    <input aria-label="Nombre de répétitions par série" min="1" placeholder="Reps" type="number" value={newExercise.reps} onChange={(event) => updateExercise('reps', event.target.value)} />
    <input aria-label="Intensité" placeholder="Intensité (ex. 75%)" value={newExercise.intensity} onChange={(event) => updateExercise('intensity', event.target.value)} />
    <button className="btn btn-primary" type="submit">+ Ajouter l'exercice</button>
  </form>
  <div className="program-exercises">
    {(program.exercises || []).map((exercise) => (
      <div className="program-exercise-row" key={exercise.id}>
        <span>
          <strong>{exercise.name}</strong>
          <small>{exercise.sets} x {exercise.reps} at {exercise.intensity || '-'} intensity</small>
        </span>
        <button aria-label={`Supprimer ${exercise.name}`} className="delete-exercise" onClick={() => removeExerciseFromProgram(program.id, exercise.id)}>×</button>
      </div>
    ))}
  </div>

  <div className="duplicate-row">
    <select aria-label={`Client cible pour ${program.name}`} value={duplicateTargets[program.id] || ''} onChange={(event) => setDuplicateTargets((current) => ({ ...current, [program.id]: event.target.value }))}>
      <option value="">Dupliquer vers...</option>
      {clients.filter(({ id }) => id !== program.clientId).map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
    </select>
    <button className="text-button" disabled={!duplicateTargets[program.id]} onClick={() => duplicateProgram(program)} type="button">Dupliquer</button>
  </div>
</article>
                  ))}
                  {!programs.some(({ clientId }) => clientId === selectedClientId) && <p className="empty">Créez un programme pour ce client.</p>}
                </div>
              </>
            ) : <p className="empty">Sélectionnez un client pour gérer ses programmes.</p>}
          </div>
        </aside>

        <section className="section workspace">
          {selectedClient ? (
            <>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PROFIL ACTIF</p>
                  <h2>{selectedClient.name}</h2>
                  {selectedClient.goal && <p className="client-goal">Objectif: {selectedClient.goal}</p>}
                </div>
                <div className="profile-actions">
                  <strong className="session-count">{clientWorkouts.length} séances</strong>
                  <button className="btn btn-primary print-button" onClick={exportClientPdf} type="button">Exporter PDF</button>
                </div>
              </div>

              <form className="form-group" onSubmit={addWorkout}>
                <input aria-label="Exercice" placeholder="Exercice" value={newWorkout.exercise} onChange={(event) => updateWorkout('exercise', event.target.value)} />
                <input aria-label="Poids en kilogrammes" min="0" placeholder="Poids (kg)" type="number" value={newWorkout.weight} onChange={(event) => updateWorkout('weight', event.target.value)} />
                <input aria-label="Nombre de répétitions" min="1" placeholder="Reps" type="number" value={newWorkout.reps} onChange={(event) => updateWorkout('reps', event.target.value)} />
                <input aria-label="RPE sur 10" max="10" min="1" placeholder="RPE / 10" step="0.5" type="number" value={newWorkout.rpe} onChange={(event) => updateWorkout('rpe', event.target.value)} />
                <button className="btn btn-primary" type="submit">+ Enregistrer la séance</button>
              </form>

              <div className="stats-block">
                <div className="section-heading compact-heading">
                  <h3>Statistiques par exercice</h3>
                  <span className="muted">Poids de travail</span>
                </div>
                {exerciseStats.length ? exerciseStats.map((stat) => (
                  <div className="exercise-progress" key={stat.exercise}>
                    <div className="exercise-title"><strong>{stat.exercise}</strong><span>{stat.sessions} séance(s)</span></div>
                    <div className="progress-bar"><div className="progress" style={{ width: `${Math.max(8, (stat.avg / stat.max) * 100)}%` }}><span className="weight-label">{stat.avg.toFixed(1)} kg moyen</span></div></div>
                    <div className="stat-line"><span>Min <b>{stat.min} kg</b></span><span>Max <b>{stat.max} kg</b></span><span>Moyenne <b>{stat.avg.toFixed(1)} kg</b></span></div>
                    <p style={{ color: '#FF0000', fontWeight: 700 }}>1RM estimé: {stat.oneRepMax.toFixed(1)} kg</p>
                    {(() => {
                      const chartSessions = clientWorkouts
                        .filter(({ exercise }) => exercise === stat.exercise)
                        .sort((first, second) => new Date(first.date.split('/').reverse().join('-')) - new Date(second.date.split('/').reverse().join('-')))
                      const chartWidth = 600
                      const chartHeight = 190
                      const chartPadding = { top: 18, right: 18, bottom: 38, left: 48 }
                      const plotWidth = chartWidth - chartPadding.left - chartPadding.right
                      const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom
                      const weights = chartSessions.map(({ weight }) => Number(weight))
                      const chartMin = Math.min(...weights)
                      const chartMax = Math.max(...weights)
                      const weightRange = chartMax - chartMin || 1
                      const points = chartSessions.map((workout, index) => ({
                        x: chartPadding.left + (chartSessions.length === 1 ? plotWidth / 2 : (index / (chartSessions.length - 1)) * plotWidth),
                        y: chartPadding.top + ((chartMax - Number(workout.weight)) / weightRange) * plotHeight,
                      }))

                      return (
                        <div className="progression-chart">
                          <svg aria-label={`Progression du poids pour ${stat.exercise}`} role="img" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                            <line className="chart-axis" x1={chartPadding.left} x2={chartPadding.left} y1={chartPadding.top} y2={chartHeight - chartPadding.bottom} />
                            <line className="chart-axis" x1={chartPadding.left} x2={chartWidth - chartPadding.right} y1={chartHeight - chartPadding.bottom} y2={chartHeight - chartPadding.bottom} />
                            <text className="chart-y-label" x="8" y={chartPadding.top + 4}>{chartMax} kg</text>
                            <text className="chart-y-label" x="8" y={chartHeight - chartPadding.bottom}>{chartMin} kg</text>
                            <polyline className="chart-line" fill="none" points={points.map(({ x, y }) => `${x},${y}`).join(' ')} />
                            {points.map(({ x, y }, index) => (
                              <g key={chartSessions[index].id}>
                                <circle className="chart-dot" cx={x} cy={y} r="4" />
                                <text className="chart-x-label" textAnchor="middle" x={x} y={chartHeight - 12}>{chartSessions[index].date}</text>
                              </g>
                            ))}
                          </svg>
                        </div>
                      )
                    })()}
                  </div>
                )) : <p className="empty">Aucune statistique pour le moment.</p>}
              </div>

              <div className="history">
                <div className="section-heading compact-heading"><h3>Historique récent</h3><span className="muted">{clientWorkouts.length} entrée(s)</span></div>
                {clientWorkouts.length ? clientWorkouts.map((workout) => (
                  <article className="workout-card" key={workout.id}>
                    <div className="workout-header"><strong>{workout.exercise}</strong><span className="date">{workout.date}</span></div>
                    <div className="workout-details"><span>{workout.weight} kg</span><span>{workout.reps} reps</span><span>RPE {workout.rpe || '—'}</span><button className="text-button" onClick={() => removeWorkout(workout.id)} type="button">Supprimer</button></div>
                  </article>
                )) : <p className="empty">Enregistrez une séance pour commencer le suivi.</p>}
              </div>
            </>
          ) : <p className="empty">Sélectionnez un client pour voir son suivi.</p>}
        </section>
      </main>

      <section className="print-report">
        <p className="eyebrow">RAPPORT CLIENT</p>
        <h1>{selectedClient?.name || 'Client'}</h1>
        <p className="print-goal"><strong>Objectif:</strong> {selectedClient?.goal || 'Non renseigné'}</p>

        <h2>Statistiques par exercice</h2>
        {exerciseStats.length ? (
          <table>
            <thead><tr><th>Exercice</th><th>Min</th><th>Max</th><th>Moyenne</th><th>1RM estimé</th></tr></thead>
            <tbody>
              {exerciseStats.map((stat) => (
                <tr key={stat.exercise}>
                  <td>{stat.exercise}</td>
                  <td>{stat.min} kg</td>
                  <td>{stat.max} kg</td>
                  <td>{stat.avg.toFixed(1)} kg</td>
                  <td>{stat.oneRepMax.toFixed(1)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>Aucune statistique disponible.</p>}

        <h2>Historique des séances</h2>
        {clientWorkouts.length ? (
          <table>
            <thead><tr><th>Date</th><th>Exercice</th><th>Poids</th><th>Reps</th><th>RPE</th></tr></thead>
            <tbody>
              {clientWorkouts.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.date}</td>
                  <td>{workout.exercise}</td>
                  <td>{workout.weight} kg</td>
                  <td>{workout.reps}</td>
                  <td>{workout.rpe || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>Aucune séance enregistrée.</p>}
      </section>
    </div>
  )
}

export default App