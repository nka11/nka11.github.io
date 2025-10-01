---
title: Pourquoi basculer sur Rust
description: "Pas de garbage, pas de surprise. Juste Rust"
slug: "2025-rust-no-garbage"
date: "2025-10-01"
tags:
  - programming
image: '/images/iagen/NicoGarbageKick.png'
---

# Pourquoi basculer sur Rust ?

J’ai passé assez de temps dans le code pour savoir une chose : **chaque langage a ses promesses, mais très peu tiennent vraiment la route quand on parle de performance et de fiabilité**. Rust, lui, coche les cases qui comptent.

## La mémoire : fin de la roulette russe

En C et C++, tu joues à la roulette russe avec chaque pointeur. Fuites, corruptions, segfaults... En Java, en Python, tu te demandes toujours si tout est bien déréférencé, tu profile pour chercher des fuites mémoires. Dans chaque cas, on finit par considérer ça comme “normal”, mais Rust vient nous prouver que ça ne l’est pas. Son système d’ownership et de borrow checker t’empêche de foutre le bordel en mémoire **SANS** avoir besoin de Garbage Collector.
Résultat : **plus de bugs crades liés à la mémoire, et plus d'interférence du GC**.

## Le mythe du Garbage Collector

Soyons clairs :
**Quand il y a un GC, ça veut dire qu’il y a du nettoyage à faire, donc qu’il y a des choses sales qui se passent ! Rust ne laisse pas de saletés !**
Pas de GC, pas de pauses imprévisibles, pas de coût caché. Tu gardes la main sur les perfs sans sacrifier la lisibilité du code.

## Cargo : enfin un outil qui respecte ton temps

Si tu viens du monde C/C++, tu sais la douleur que c’est de gérer un projet, ses dépendances et son build system. Avec Rust, **Cargo fait le taf, simplement, efficacement**. Tu peux te concentrer sur ton code, pas sur le bricolage autour.

## Une montée en compétences qui fait mal… mais qui paye

Oui, Rust est exigeant. Le borrow checker va t’insulter au début, tu vas vouloir casser ton clavier. Mais une fois passé le cap, **ton code est propre, solide, et passe plus de temps à écrire du code utile qu'a tracker les cause de segmentation fault ou out-of-memory.**.

## Rust, c’est pour aujourd’hui et demain

Rust n’est pas un jouet ou une hype de plus. Des mastodontes comme Mozilla, Microsoft, Amazon ou le noyau Linux l’utilisent déjà. Et il ouvre des portes : WebAssembly, embarqué, systèmes critiques…
C’est un langage qui ne triche pas, qui ne met pas de pansement sur des problèmes structurels parce qu'il est structurellement pensé pour être sécurisé et robuste.

## La loi d'Eroom : sobriété et efficacité

### Rust et la loi d’Eroom

La loi d’Eroom, théorisée par Tristan Nitot comme une inversion de la loi de Moore, propose de libérer régulièrement des ressources en optimisant les logiciels plutôt qu’en attendant des miracles du matériel. Rust colle parfaitement à cette philosophie : ses performances natives, sa gestion fine de la mémoire et son absence de GC permettent de **faire mieux avec le même matériel, sur la durée**. Là où d’autres langages masquent l’inefficience derrière la puissance croissante des processeurs, Rust s’inscrit dans une logique d’optimisation continue. C’est un langage qui donne les outils pour coder dans l’esprit de la loi d’Eroom : libérer plutôt que gaspiller.

---

### En résumé

Rust, c’est **la performance du bas niveau sans les risques de sa permissivité**. Pas de GC, pas de surprises, pas de dettes planquées. Juste du code rapide, sûr, clair… et durable.

---

### Références

* Matsakis, N. & Klock, F. (2014). *The Rust Language*. Mozilla Research.
* Linux Foundation (2022). *Rust support in the Linux kernel*.
* Courtois, N. (2023). *Sobriété numérique et frugalité logicielle*.
* Rust Foundation (2024). *State of Rust Survey*.
* https://www.lewebvert.fr/blog/2024-06-20-interview-tristan-nitot/
* https://github.com/uutils/coreutils/
