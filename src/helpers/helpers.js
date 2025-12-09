export const getPatientName = (patients,patientId) => {
    const p = patients?.find((x) => x.id === patientId);
    if (!p) return `Patient #${patientId}`;
    return `${p.first_name} ${p.last_name}`;
  };