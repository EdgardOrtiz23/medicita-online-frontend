import { useMemo, useState } from "react";

function formatDate(date, lang) {
  if (!date) return "—";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(
    lang === "en" ? "en-US" : "es-NI",
    { day: "2-digit", month: "long", year: "numeric" },
  );
}

function formatTime(time, lang) {
  if (!time) return "—";
  const parsed = new Date(`2000-01-01T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return time;
  return parsed.toLocaleTimeString(
    lang === "en" ? "en-US" : "es-NI",
    { hour: "numeric", minute: "2-digit" },
  );
}

function getAppointmentDate(appointment) {
  const value = `${appointment.fecha || ""}T${appointment.hora || "23:59"}`;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export default function AppointmentsList({
  lang,
  appointments,
  onCancel,
  onDelete,
  onRequestAppointment,
  fullPage = false,
}) {
  const [filter, setFilter] = useState("all");
  const [pendingCancel, setPendingCancel] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const copy =
    lang === "en"
      ? {
          title: "My appointments",
          subtitle: "Review and organize your requested appointments.",
          upcoming: "Upcoming appointments",
          history: "Appointment history",
          all: "All",
          pending: "Pending",
          cancelled: "Cancelled",
          empty: "You don't have any appointments yet.",
          emptyText: "When you book a medical appointment, it will appear here.",
          request: "Book an appointment",
          reason: "Reason",
          specialty: "Specialty",
          doctor: "Doctor",
          date: "Date",
          time: "Time",
          status: "Status",
          created: "Created",
          cancel: "Cancel appointment",
          confirmTitle: "Cancel appointment?",
          confirm: "Are you sure you want to cancel this appointment?",
          confirmAction: "Confirm cancellation",
          back: "Go back",
          noReason: "No reason provided",
          deleteRecord: "Delete record",
          deleteTitle: "Delete appointment record?",
          deleteConfirm: "Do you want to permanently delete this appointment? This action cannot be undone.",
          deleteAction: "Delete",
          deleteSuccess: "Appointment deleted successfully.",
        }
      : {
          title: "Mis citas",
          subtitle: "Consulta y organiza las citas que has solicitado.",
          upcoming: "Próximas citas",
          history: "Historial de citas",
          all: "Todas",
          pending: "Pendientes",
          cancelled: "Canceladas",
          empty: "No tienes citas todavía.",
          emptyText: "Cuando solicites una cita médica, aparecerá aquí.",
          request: "Solicitar una cita",
          reason: "Motivo",
          specialty: "Especialidad",
          doctor: "Médico",
          date: "Fecha",
          time: "Hora",
          status: "Estado",
          created: "Creada",
          cancel: "Cancelar cita",
          confirmTitle: "¿Cancelar cita?",
          confirm: "¿Estás seguro de que deseas cancelar esta cita?",
          confirmAction: "Confirmar cancelación",
          back: "Volver",
          noReason: "Sin motivo indicado",
          deleteRecord: "Eliminar registro",
          deleteTitle: "¿Eliminar registro de la cita?",
          deleteConfirm: "¿Quieres eliminar definitivamente esta cita? Esta acción no se puede deshacer.",
          deleteAction: "Eliminar",
          deleteSuccess: "Cita eliminada correctamente.",
        };

  const sorted = useMemo(
    () => [...appointments].sort((a, b) => getAppointmentDate(a) - getAppointmentDate(b)),
    [appointments],
  );

  const filtered = useMemo(
    () =>
      sorted.filter((appointment) => {
        if (filter === "pending") return appointment.estado === "Pendiente";
        if (filter === "cancelled") return appointment.estado === "Cancelada";
        return true;
      }),
    [sorted, filter],
  );

  const now = Date.now();
  const upcoming = filtered.filter(
    (appointment) =>
      appointment.estado === "Pendiente" && getAppointmentDate(appointment) >= now,
  );
  const history = filtered.filter(
    (appointment) =>
      appointment.estado === "Cancelada" || getAppointmentDate(appointment) < now,
  );

  const openCancel = (appointment) => setPendingCancel(appointment);
  const confirmCancel = () => {
    if (!pendingCancel) return;
    onCancel(pendingCancel.id);
    setPendingCancel(null);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    onDelete(pendingDelete.id);
    setPendingDelete(null);
  };

  const renderCard = (appointment) => {
    const cancelled = appointment.estado === "Cancelada";
    const identifier = String(appointment.id || "").slice(-8) || "—";
    const createdAt = appointment.createdAt || appointment.fechaCreacion || appointment.created_at;

    return (
      <article
        className={`appointment-detail-card ${cancelled ? "is-cancelled" : ""}`}
        key={appointment.id}
      >
        <div className="appointment-card-head">
          <div className="appointment-specialty">
            <div className="record-icon">✚</div>
            <div>
              <span>{appointment.especialidad || "—"}</span>
              <strong>{appointment.medico || "—"}</strong>
            </div>
          </div>
          <span className={`appointment-status ${cancelled ? "cancelled" : "pending"}`}>
            {cancelled ? copy.cancelled : copy.pending}
          </span>
        </div>

        <div className="appointment-info-grid">
          <div className="appointment-info-item">
            <span>{copy.date}</span>
            <strong>{formatDate(appointment.fecha, lang)}</strong>
          </div>
          <div className="appointment-info-item">
            <span>{copy.time}</span>
            <strong>{formatTime(appointment.hora, lang)}</strong>
          </div>
          <div className="appointment-info-item">
            <span>{copy.specialty}</span>
            <strong>{appointment.especialidad || "—"}</strong>
          </div>
          <div className="appointment-info-item">
            <span>{copy.doctor}</span>
            <strong>{appointment.medico || "—"}</strong>
          </div>
        </div>

        <div className="appointment-reason-block">
          <span>{copy.reason}</span>
          <p>{appointment.motivo || copy.noReason}</p>
        </div>

        <div className="appointment-card-footer">
          <div className="appointment-meta">
            <span>ID: {identifier}</span>
            {createdAt && <span>{copy.created}: {formatDate(String(createdAt).slice(0, 10), lang)}</span>}
          </div>
          {cancelled ? (
            <button type="button" className="delete-cancelled-appointment" onClick={() => setPendingDelete(appointment)}>
              {copy.deleteRecord}
            </button>
          ) : (
            <button type="button" className="cancel-appointment" onClick={() => openCancel(appointment)}>
              {copy.cancel}
            </button>
          )}
        </div>
      </article>
    );
  };

  const renderSection = (title, items) => (
    <section className="appointments-group">
      <div className="appointments-group-heading">
        <h2>{title}</h2>
        <span>{items.length}</span>
      </div>
      {items.length ? (
        <div className="appointments-list">{items.map(renderCard)}</div>
      ) : (
        <div className="appointments-section-empty">
          <span>✓</span>
          <p>{filter === "all" ? copy.emptyText : "—"}</p>
        </div>
      )}
    </section>
  );

  if (!appointments.length) {
    return (
      <section className={`appointments-panel ${fullPage ? "appointments-panel-full" : ""}`}>
        <div className="appointments-empty">
          <div className="empty-icon">＋</div>
          <h3>{copy.empty}</h3>
          <p>{copy.emptyText}</p>
          {onRequestAppointment && (
            <button type="button" className="empty-action" onClick={onRequestAppointment}>
              {copy.request} <span>→</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={`appointments-panel ${fullPage ? "appointments-panel-full" : ""}`}>
        <div className="appointments-heading">
          <div>
            <span className="section-kicker">MEDICITA ONLINE</span>
            <h2>{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </div>
          <span className="appointments-count">{filtered.length}</span>
        </div>

        <div className="appointment-filters" role="tablist" aria-label={copy.title}>
          {[
            ["all", copy.all],
            ["pending", copy.pending],
            ["cancelled", copy.cancelled],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {filter === "all" ? (
          <>
            {renderSection(copy.upcoming, upcoming)}
            {renderSection(copy.history, history)}
          </>
        ) : (
          renderSection(filter === "pending" ? copy.upcoming : copy.history, filtered)
        )}
      </section>

      {pendingCancel && (
        <div className="appointment-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
          <div className="appointment-confirm">
            <div className="confirm-icon">!</div>
            <h2 id="cancel-title">{copy.confirmTitle}</h2>
            <p>{copy.confirm}</p>
            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={() => setPendingCancel(null)}>
                {copy.back}
              </button>
              <button type="button" className="cancel-confirm" onClick={confirmCancel}>
                {copy.confirmAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="appointment-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="appointment-confirm">
            <div className="confirm-icon">!</div>
            <h2 id="delete-title">{copy.deleteTitle}</h2>
            <p>{copy.deleteConfirm}</p>
            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={() => setPendingDelete(null)}>
                {copy.back}
              </button>
              <button type="button" className="delete-confirm" onClick={confirmDelete}>
                {copy.deleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
