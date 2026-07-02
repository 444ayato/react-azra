import { supabase } from '../lib/supabase';

export const appointmentService = {
  /**
   * Get all appointments (Admin)
   */
  getAllAppointments: async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(name, phone)')
      .order('appointment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get appointments by patient_id
   */
  getAppointmentsByPatientId: async (patientId) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get appointments by date range
   */
  getAppointmentsByDateRange: async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(name, phone)')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create appointment
   */
  createAppointment: async ({ patient_id, service_name, appointment_date, appointment_time, notes }) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id,
        service_name,
        appointment_date,
        appointment_time,
        status: 'pending',
        notes: notes || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update appointment status
   */
  updateAppointmentStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update appointment
   */
  updateAppointment: async (id, updates) => {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete appointment
   */
  deleteAppointment: async (id) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export default appointmentService;
