import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateCaptcha } from "../utils/captcha";
import { getStudentProfile, hasCompletedOnboarding, saveStudentProfile } from "../utils/storage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    enrollment: "",
    password: "",
    captcha: ""
  });
  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasCompletedOnboarding()) {
      navigate("/feed/all", { replace: true });
    }
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function refreshCaptcha() {
    setCaptchaText(generateCaptcha());
    setForm((current) => ({ ...current, captcha: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.captcha.trim().toUpperCase() !== captchaText) {
      setError("Captcha does not match. Please try again.");
      refreshCaptcha();
      return;
    }

    const existing = getStudentProfile();
    const nextProfile = {
      enrollment: form.enrollment,
      password: form.password,
      clubs: existing?.clubs || [],
      onboardingComplete: Boolean(existing?.onboardingComplete)
    };

    saveStudentProfile(nextProfile);
    navigate(nextProfile.onboardingComplete ? "/feed/all" : "/onboarding");
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-hero__overlay">
          <div className="login-hero__copy">
            <p className="eyebrow">Student Clubs Management Portal</p>
            <h1>Graphic Era campus life, redesigned for student clubs.</h1>
            
          </div>

          <div className="portal-card">
            <div className="portal-card__top">
              <div className="portal-card__brand-image">
                <img
                  src="https://student.geu.ac.in/Account/showClientLoginPageLogo"
                  alt="Graphic Era logo"
                />
              </div>
            </div>


            <form className="portal-card__form" onSubmit={handleSubmit}>
              <label>
                <span>Enrollment Number</span>
                <input
                  name="enrollment"
                  placeholder="Enter enrollment number"
                  value={form.enrollment}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="captcha-row">
                <button type="button" className="captcha-refresh" onClick={refreshCaptcha}>
                  Refresh
                </button>
                <div className="captcha-display" aria-label="Generated captcha">
                  {captchaText}
                </div>
              </div>

              <label>
                <span>Enter Captcha</span>
                <input
                  name="captcha"
                  placeholder="Type the captcha shown above"
                  value={form.captcha}
                  onChange={handleChange}
                  required
                />
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="primary-button">
                Login
              </button>

              <div className="portal-card__links">
                <button type="button">Forgot password?</button>
                <button type="button">Forgot ID?</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
