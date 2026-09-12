import { useEffect, useMemo, useState } from "react";
import "./ProfilePage.css";
import { getProfile, saveProfile } from "../services/profileService";

const EMPTY_VALUE = "—";

function calculateAge(dateString) {
  if (!dateString) return null;

  const birthDate = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function formatBirthDate(dateString, lang) {
  if (!dateString) return EMPTY_VALUE;

  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString(lang === "en" ? "en-US" : "es-NI", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getTodayString() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function getCompletion(profile) {
  const fields = [
    profile.nombreCompleto,
    profile.correoElectronico,
    profile.fechaNacimiento,
    profile.sexo,
    profile.telefono,
    profile.peso,
    profile.altura,
    profile.direccion,
    profile.ciudad,
    profile.contactoEmergencia,
    profile.telefonoEmergencia,
  ];

  const completed = fields.filter(
    (value) => value !== undefined && value !== null && String(value).trim() !== "",
  ).length;

  return Math.round((completed / fields.length) * 100);
}

function normalizeNumber(value) {
  return value === "" ? "" : Number(value);
}

export default function ProfilePage({ lang, user, onBack }) {
  const copy =
    lang === "en"
      ? {
          kicker: "MEDICITA ONLINE",
          title: "My profile",
          subtitle: "Manage your personal information and keep your health details organized.",
          back: "← Back to Home",
          edit: "Edit profile",
          save: "Save changes",
          cancel: "Cancel",
          personal: "Personal information",
          physical: "Physical information",
          additional: "Additional information",
          fullName: "Full name",
          email: "Email address",
          birthDate: "Date of birth",
          age: "Age",
          sex: "Sex",
          phone: "Phone",
          weight: "Weight",
          height: "Height",
          address: "Address",
          city: "City",
          emergencyContact: "Emergency contact",
          emergencyPhone: "Emergency phone",
          unspecified: "Not specified",
          incompleteTitle: "Your profile is incomplete",
          completeTitle: "Profile completed",
          completeText: "Complete some details to keep your information organized.",
          saveSuccess: "Profile updated successfully.",
          required: "Please enter your full name and email address.",
          invalidBirth: "Date of birth cannot be in the future.",
          invalidWeight: "Weight must be between 20 and 300 kg.",
          invalidHeight: "Height must be between 80 and 250 cm.",
          invalidPhone: "Please enter a valid phone number.",
          sexOptions: { female: "Female", male: "Male", other: "Other", noSpecify: "Prefer not to say" },
          placeholderName: "Your full name",
          placeholderPhone: "Phone number",
          placeholderAddress: "Street, neighborhood or reference",
          placeholderCity: "City",
          placeholderEmergency: "Full name",
          placeholderEmergencyPhone: "Phone number",
          kg: "kg",
          cm: "cm",
        }
      : {
          kicker: "MEDICITA ONLINE",
          title: "Mi perfil",
          subtitle: "Administra tu información personal y mantén organizados tus datos de salud.",
          back: "← Volver al inicio",
          edit: "Editar perfil",
          save: "Guardar cambios",
          cancel: "Cancelar",
          personal: "Información personal",
          physical: "Información física",
          additional: "Información adicional",
          fullName: "Nombre completo",
          email: "Correo electrónico",
          birthDate: "Fecha de nacimiento",
          age: "Edad",
          sex: "Sexo",
          phone: "Teléfono",
          weight: "Peso",
          height: "Altura",
          address: "Dirección",
          city: "Ciudad",
          emergencyContact: "Contacto de emergencia",
          emergencyPhone: "Teléfono de emergencia",
          unspecified: "No especificada",
          incompleteTitle: "Tu perfil está incompleto",
          completeTitle: "Perfil completado",
          completeText: "Completa algunos datos para tener tu información organizada.",
          saveSuccess: "Perfil actualizado correctamente.",
          required: "Ingresa tu nombre completo y correo electrónico.",
          invalidBirth: "La fecha de nacimiento no puede ser futura.",
          invalidWeight: "El peso debe estar entre 20 y 300 kg.",
          invalidHeight: "La altura debe estar entre 80 y 250 cm.",
          invalidPhone: "Ingresa un número de teléfono válido.",
          sexOptions: { female: "Femenino", male: "Masculino", other: "Otro", noSpecify: "Prefiero no decirlo" },
          placeholderName: "Tu nombre completo",
          placeholderPhone: "Número de teléfono",
          placeholderAddress: "Calle, barrio o referencia",
          placeholderCity: "Ciudad",
          placeholderEmergency: "Nombre completo",
          placeholderEmergencyPhone: "Número de teléfono",
          kg: "kg",
          cm: "cm",
        };

  const [profile, setProfile] = useState(() => getProfile(user));
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => getProfile(user));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const next = getProfile(user);
    setProfile(next);
    setDraft(next);
    setEditing(false);
  }, [user]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const age = useMemo(() => calculateAge(profile.fechaNacimiento), [profile.fechaNacimiento]);
  const completion = useMemo(() => getCompletion(profile), [profile]);
  const initial = (profile.nombreCompleto || profile.correoElectronico || "U")
    .trim()
    .charAt(0)
    .toUpperCase();
  const today = getTodayString();

  const display = (value) => value || EMPTY_VALUE;

  const updateDraft = (field, value) => {
    setError("");
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const email = draft.correoElectronico.trim();
    const looksLikeEmail = email.includes("@");
    const validEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // The current authentication demo can use a username ("prueba") instead of an email.
    // Keep that existing identity valid while still checking real email formats when supplied.
    if (!draft.nombreCompleto.trim() || !email || (looksLikeEmail && !validEmailFormat)) {
      return copy.required;
    }

    if (draft.fechaNacimiento && draft.fechaNacimiento > today) {
      return copy.invalidBirth;
    }

    if (draft.peso !== "" && (!Number.isFinite(Number(draft.peso)) || Number(draft.peso) < 20 || Number(draft.peso) > 300)) {
      return copy.invalidWeight;
    }

    if (draft.altura !== "" && (!Number.isFinite(Number(draft.altura)) || Number(draft.altura) < 80 || Number(draft.altura) > 250)) {
      return copy.invalidHeight;
    }

    const phoneFields = [draft.telefono, draft.telefonoEmergencia].filter(Boolean);
    if (phoneFields.some((phone) => String(phone).replace(/\D/g, "").length < 7)) {
      return copy.invalidPhone;
    }

    return "";
  };

  const handleSave = (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const nextProfile = saveProfile(user, {
      ...draft,
      nombreCompleto: draft.nombreCompleto.trim(),
      correoElectronico: draft.correoElectronico.trim(),
      peso: normalizeNumber(draft.peso),
      altura: normalizeNumber(draft.altura),
    });

    setProfile(nextProfile);
    setDraft(nextProfile);
    setEditing(false);
    setError("");
    setNotice(copy.saveSuccess);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
    setError("");
  };

  const renderValue = (value) => <span className={value ? "" : "profile-value-muted"}>{display(value)}</span>;

  return (
    <main className="profile-page">
      {notice && <div className="profile-toast" role="status"><span>✓</span>{notice}</div>}

      <div className="profile-shell">
        <div className="profile-topbar">
          <button type="button" className="profile-back" onClick={onBack}>{copy.back}</button>
          {!editing && (
            <button type="button" className="profile-edit-button" onClick={() => setEditing(true)}>
              ✎ {copy.edit}
            </button>
          )}
        </div>

        <header className="profile-header">
          <div>
            <span className="section-kicker">{copy.kicker}</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
        </header>

        <section className="profile-identity-card">
          <div className="profile-avatar">{initial}</div>
          <div className="profile-identity-copy">
            <strong>{display(profile.nombreCompleto)}</strong>
            <span>{display(profile.correoElectronico)}</span>
          </div>
          <div className="profile-progress">
            <div className="profile-progress-heading">
              <span>{completion === 100 ? copy.completeTitle : copy.incompleteTitle}</span>
              <strong>{completion}%</strong>
            </div>
            <div className="profile-progress-track" aria-label={`${completion}%`}>
              <span style={{ width: `${completion}%` }} />
            </div>
            <p>{copy.completeText}</p>
          </div>
        </section>

        <form onSubmit={handleSave}>
          {error && <div className="profile-error" role="alert">{error}</div>}

          <section className="profile-section-card">
            <div className="profile-section-heading">
              <div className="profile-section-icon">♙</div>
              <div><h2>{copy.personal}</h2></div>
            </div>

            <div className="profile-fields">
              {editing ? (
                <>
                  <label className="profile-field">
                    <span>{copy.fullName}</span>
                    <input value={draft.nombreCompleto} onChange={(event) => updateDraft("nombreCompleto", event.target.value)} placeholder={copy.placeholderName} />
                  </label>
                  <label className="profile-field">
                    <span>{copy.email}</span>
                    <input type="email" value={draft.correoElectronico} onChange={(event) => updateDraft("correoElectronico", event.target.value)} />
                  </label>
                  <label className="profile-field">
                    <span>{copy.birthDate}</span>
                    <input type="date" max={today} value={draft.fechaNacimiento} onChange={(event) => updateDraft("fechaNacimiento", event.target.value)} />
                  </label>
                  <div className="profile-field profile-readonly">
                    <span>{copy.age}</span>
                    <strong>{calculateAge(draft.fechaNacimiento) ?? copy.unspecified}{calculateAge(draft.fechaNacimiento) !== null ? (lang === "en" ? " years" : " años") : ""}</strong>
                  </div>
                  <label className="profile-field">
                    <span>{copy.sex}</span>
                    <select value={draft.sexo} onChange={(event) => updateDraft("sexo", event.target.value)}>
                      <option value="">{copy.unspecified}</option>
                      <option value="female">{copy.sexOptions.female}</option>
                      <option value="male">{copy.sexOptions.male}</option>
                      <option value="other">{copy.sexOptions.other}</option>
                      <option value="noSpecify">{copy.sexOptions.noSpecify}</option>
                    </select>
                  </label>
                  <label className="profile-field">
                    <span>{copy.phone}</span>
                    <input type="tel" value={draft.telefono} onChange={(event) => updateDraft("telefono", event.target.value)} placeholder={copy.placeholderPhone} />
                  </label>
                </>
              ) : (
                <>
                  <div className="profile-field"><span>{copy.fullName}</span>{renderValue(profile.nombreCompleto)}</div>
                  <div className="profile-field"><span>{copy.email}</span>{renderValue(profile.correoElectronico)}</div>
                  <div className="profile-field"><span>{copy.birthDate}</span>{renderValue(formatBirthDate(profile.fechaNacimiento, lang))}</div>
                  <div className="profile-field"><span>{copy.age}</span>{renderValue(age === null ? "" : `${age} ${lang === "en" ? "years" : "años"}`)}</div>
                  <div className="profile-field"><span>{copy.sex}</span>{renderValue(profile.sexo ? copy.sexOptions[profile.sexo] : "")}</div>
                  <div className="profile-field"><span>{copy.phone}</span>{renderValue(profile.telefono)}</div>
                </>
              )}
            </div>
          </section>

          <section className="profile-section-card">
            <div className="profile-section-heading">
              <div className="profile-section-icon physical">⌁</div>
              <div><h2>{copy.physical}</h2></div>
            </div>

            <div className="profile-fields profile-fields-two">
              {editing ? (
                <>
                  <label className="profile-field">
                    <span>{copy.weight}</span>
                    <div className="input-with-unit"><input type="number" min="20" max="300" step="0.1" value={draft.peso} onChange={(event) => updateDraft("peso", event.target.value)} /><b>{copy.kg}</b></div>
                  </label>
                  <label className="profile-field">
                    <span>{copy.height}</span>
                    <div className="input-with-unit"><input type="number" min="80" max="250" step="0.1" value={draft.altura} onChange={(event) => updateDraft("altura", event.target.value)} /><b>{copy.cm}</b></div>
                  </label>
                </>
              ) : (
                <>
                  <div className="profile-field"><span>{copy.weight}</span>{profile.peso !== "" ? `${profile.peso} ${copy.kg}` : EMPTY_VALUE}</div>
                  <div className="profile-field"><span>{copy.height}</span>{profile.altura !== "" ? `${profile.altura} ${copy.cm}` : EMPTY_VALUE}</div>
                </>
              )}
            </div>
          </section>

          <section className="profile-section-card">
            <div className="profile-section-heading">
              <div className="profile-section-icon additional">⌂</div>
              <div><h2>{copy.additional}</h2></div>
            </div>

            <div className="profile-fields">
              {editing ? (
                <>
                  <label className="profile-field profile-field-wide">
                    <span>{copy.address}</span>
                    <input value={draft.direccion} onChange={(event) => updateDraft("direccion", event.target.value)} placeholder={copy.placeholderAddress} />
                  </label>
                  <label className="profile-field">
                    <span>{copy.city}</span>
                    <input value={draft.ciudad} onChange={(event) => updateDraft("ciudad", event.target.value)} placeholder={copy.placeholderCity} />
                  </label>
                  <label className="profile-field">
                    <span>{copy.emergencyContact}</span>
                    <input value={draft.contactoEmergencia} onChange={(event) => updateDraft("contactoEmergencia", event.target.value)} placeholder={copy.placeholderEmergency} />
                  </label>
                  <label className="profile-field">
                    <span>{copy.emergencyPhone}</span>
                    <input type="tel" value={draft.telefonoEmergencia} onChange={(event) => updateDraft("telefonoEmergencia", event.target.value)} placeholder={copy.placeholderEmergencyPhone} />
                  </label>
                </>
              ) : (
                <>
                  <div className="profile-field profile-field-wide"><span>{copy.address}</span>{renderValue(profile.direccion)}</div>
                  <div className="profile-field"><span>{copy.city}</span>{renderValue(profile.ciudad)}</div>
                  <div className="profile-field"><span>{copy.emergencyContact}</span>{renderValue(profile.contactoEmergencia)}</div>
                  <div className="profile-field"><span>{copy.emergencyPhone}</span>{renderValue(profile.telefonoEmergencia)}</div>
                </>
              )}
            </div>
          </section>

          {editing && (
            <div className="profile-form-actions">
              <button type="button" className="profile-cancel-button" onClick={handleCancel}>{copy.cancel}</button>
              <button type="submit" className="profile-save-button">{copy.save} <span>→</span></button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
