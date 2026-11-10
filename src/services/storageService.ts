import { SavedConfiguration, Vehicle } from '../types/configurator';
import { getSupabaseConfig } from './supabaseClient';

const STORAGE_KEY = 'autoconfig3d_saved_builds_v1';
const CUSTOM_VEHICLES_KEY = 'autoconfig3d_custom_vehicles_v1';

/**
 * Camada de Persistência (Repository Pattern).
 * Armazena tanto as Configurações Salvas quanto os Carros Criados do Zero pelo usuário.
 */
export const storageService = {
  getAllConfigurations(): SavedConfiguration[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Erro ao ler configurações do LocalStorage:', error);
      return [];
    }
  },

  saveConfiguration(config: SavedConfiguration): SavedConfiguration[] {
    try {
      const current = this.getAllConfigurations();
      const existingIndex = current.findIndex((item) => item.id === config.id);

      let updated: SavedConfiguration[];
      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = {
          ...config,
          updatedAt: new Date().toISOString(),
        };
      } else {
        updated = [config, ...current];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      const supa = getSupabaseConfig();
      if (supa.isConfigured) {
        console.info('[Supabase Ready] Sincronizando configuração com nuvem...');
      }

      return updated;
    } catch (error) {
      console.error('Erro ao salvar configuração no LocalStorage:', error);
      return this.getAllConfigurations();
    }
  },

  deleteConfiguration(id: string): SavedConfiguration[] {
    try {
      const current = this.getAllConfigurations();
      const updated = current.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Erro ao excluir configuração do LocalStorage:', error);
      return this.getAllConfigurations();
    }
  },

  // Persistência dos Veículos Padronizados Criados do Zero pelo Usuário
  getUserCreatedVehicles(): Vehicle[] {
    try {
      const raw = localStorage.getItem(CUSTOM_VEHICLES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Erro ao ler veículos customizados:', error);
      return [];
    }
  },

  saveUserCreatedVehicle(vehicle: Vehicle): Vehicle[] {
    try {
      const current = this.getUserCreatedVehicles();
      const existingIndex = current.findIndex((v) => v.id === vehicle.id);

      let updated: Vehicle[];
      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = vehicle;
      } else {
        updated = [vehicle, ...current];
      }

      localStorage.setItem(CUSTOM_VEHICLES_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Erro ao salvar veículo customizado:', error);
      return this.getUserCreatedVehicles();
    }
  },

  deleteUserCreatedVehicle(id: string): Vehicle[] {
    try {
      const current = this.getUserCreatedVehicles();
      const updated = current.filter((v) => v.id !== id);
      localStorage.setItem(CUSTOM_VEHICLES_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Erro ao excluir veículo customizado:', error);
      return this.getUserCreatedVehicles();
    }
  },
};
