// C:\azra-core\src\services\appointmentService.js
import supabase from '../lib/supabase';

export const appointmentService = {
  /**
   * Get all appointments (Admin)
   */
  getAllAppointments: async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  /**
   * Get appointments by customer_id (for member)
   */
  getAppointmentsByCustomerId: async (customerId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('customer_id', customerId)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching appointments by customer:', error);
      return [];
    }
  },

  /**
   * Get appointments by patient_id
   */
  getAppointmentsByPatientId: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching appointments by patient:', error);
      return [];
    }
  },

  /**
   * Get appointments by date range
   */
  getAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      return [];
    }
  },

  /**
   * Create appointment
   */
  createAppointment: async ({ customer_id, patient_name, appointment_date, appointment_time, doctor_name, source, notes }) => {
    try {
      // Cek apakah ada appointment yang sudah di-booking di tanggal yang sama
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('customer_id', customer_id)
        .eq('appointment_date', appointment_date)
        .in('status', ['scheduled', 'confirmed', 'pending']);

      if (checkError) throw checkError;

      if (existingAppointments && existingAppointments.length > 0) {
        throw new Error('Anda sudah memiliki appointment di tanggal ini. Silakan pilih tanggal lain.');
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          customer_id,
          patient_name,
          appointment_date,
          appointment_time: appointment_time || null,
          doctor_name: doctor_name || null,
          source: source || 'member',
          status: 'scheduled',
          notes: notes || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  /**
   * Update appointment status
   */
  updateAppointmentStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  /**
   * Update appointment
   */
  updateAppointment: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  /**
   * Delete appointment
   */
  deleteAppointment: async (id) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};

export default appointmentService;