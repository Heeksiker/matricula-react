import React, { useState } from "react";
import cursosData from "./data/cursos.json";
import estudianteData from "./data/estudiante.json";

function App() {
  const [selectedCursos, setSelectedCursos] = useState([]);
  const [showResumen, setShowResumen] = useState(false);
  const [creditosActuales, setCreditosActuales] = useState(0);

  // Filtrar cursos por semestre y cupos disponibles
  const cursosDisponibles = cursosData.filter(
    (curso) =>
      curso.semestre === estudianteData.semestre &&
      curso.limiteCupos > curso.matriculados
  );

  // Validación de créditos
  const puedeSeleccionar = (curso) => {
    return (
      creditosActuales + curso.creditos <= estudianteData.creditosPermitidos &&
      !selectedCursos.some((c) => c.id === curso.id)
    );
  };

  // Selección de cursos
  const handleSelect = (curso) => {
    if (puedeSeleccionar(curso)) {
      setSelectedCursos([...selectedCursos, curso]);
      setCreditosActuales(creditosActuales + curso.creditos);
    }
  };

  // Quitar curso
  const handleRemove = (curso) => {
    setSelectedCursos(selectedCursos.filter((c) => c.id !== curso.id));
    setCreditosActuales(creditosActuales - curso.creditos);
  };

  // Confirmar matrícula
  const handleConfirm = () => {
    localStorage.setItem("matricula", JSON.stringify(selectedCursos));
    setShowResumen(true);
  };

  if (!estudianteData.matriculado) {
    return <div>No puedes asignar cursos, no estás matriculado en el periodo académico.</div>;
  }

  return (
    <div className="matricula-container">
      <h2>🎓 Sistema de Matriculación Académica</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h3>Estudiante: <span style={{ color: '#1565c0' }}>{estudianteData.nombre}</span></h3>
          <h4>Carrera: <span style={{ color: '#1976d2' }}>{estudianteData.carrera}</span></h4>
          <h4>Semestre actual: <span style={{ color: '#388e3c' }}>{estudianteData.semestre}</span></h4>
          <h4>Créditos permitidos: <span style={{ color: '#1976d2' }}>{estudianteData.creditosPermitidos}</span></h4>
        </div>
      </div>

      <section style={{ marginBottom: 28 }}>
        <h3>📚 Selecciona los cursos que deseas matricular</h3>
        <ul>
          {cursosDisponibles.map((curso) => (
            <li key={curso.id}>
              <div>
                <b>{curso.nombre}</b> <span style={{ color: '#1976d2' }}>({curso.codigo})</span><br />
                <span style={{ color: '#388e3c' }}>Créditos: {curso.creditos}</span>
                <span style={{ marginLeft: 16, color: '#1565c0' }}>Cupos disponibles: {curso.limiteCupos - curso.matriculados}</span>
              </div>
              <button
                onClick={() => handleSelect(curso)}
                disabled={!puedeSeleccionar(curso)}
              >
                ➕ Agregar
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h3>✅ Cursos seleccionados para matrícula</h3>
        <ul>
          {selectedCursos.map((curso) => (
            <li key={curso.id}>
              <div>
                {curso.nombre} <span style={{ color: '#1976d2' }}>({curso.codigo})</span> - <span style={{ color: '#388e3c' }}>Créditos: {curso.creditos}</span>
              </div>
              <button onClick={() => handleRemove(curso)}>
                ❌ Eliminar
              </button>
            </li>
          ))}
        </ul>
        <div className="creditos-info">Total de créditos seleccionados: {creditosActuales}</div>
      </section>

      <button
        onClick={handleConfirm}
        disabled={selectedCursos.length === 0}
        style={{ marginTop: 20 }}
      >
        📝 Confirmar matrícula
      </button>

      {showResumen && (
        <div className="resumen-matricula">
          <h3>📄 Resumen de matrícula confirmada</h3>
          <ul>
            {selectedCursos.map((curso) => (
              <li key={curso.id}>
                {curso.nombre} <span style={{ color: '#1976d2' }}>({curso.codigo})</span> - <span style={{ color: '#388e3c' }}>Créditos: {curso.creditos}</span>
              </li>
            ))}
          </ul>
          <div style={{ fontWeight: 600, color: '#1565c0', marginTop: 10 }}>Total de créditos matriculados: {creditosActuales}</div>
        </div>
      )}
    </div>
  );
}

export default App;
