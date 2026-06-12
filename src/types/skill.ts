export type SkillId = "html" | "css" | "javascript" | "git" | "react" | "typescript";

export type Skill = {
  id: SkillId;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  epoch?: number; // 1 = Kinderzimmer (Default), 2 = Azubi-Zimmer
};
