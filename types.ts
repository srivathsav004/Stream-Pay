import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface StatProps {
  value: string;
  label: string;
}

export enum PaymentStatus {
  IDLE = 'IDLE',
  STREAMING = 'STREAMING',
  PAUSED = 'PAUSED'
}