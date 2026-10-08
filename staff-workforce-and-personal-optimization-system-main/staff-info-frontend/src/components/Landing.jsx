import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "./logo.jpeg";
import adminImg from "./admin.jpeg";
import itImg from "./it.jpg";
import featImg from "./feat.jpeg";

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const styles = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: scrolled ? 'rgba(26, 36, 86, 0.98)' : 'rgba(26, 36, 86, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: scrolled ? '0.75rem 0' : '1rem 0',
      transition: 'all 0.3s ease',
    },
    nav: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
    },
    logo: {
      height: scrolled ? '56px' : '64px',
      width: scrolled ? '56px' : '64px',
      objectFit: 'contain',
      transition: 'all 0.3s ease',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    universityName: {
      fontSize: scrolled ? '1.35rem' : '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      margin: 0,
      transition: 'all 0.3s ease',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    accreditation: {
      fontSize: '0.875rem',
      color: '#fbbf24',
      margin: 0,
      fontWeight: '500',
      letterSpacing: '0.5px',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
    },
    navButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      padding: '0.5rem 0',
      transition: 'all 0.3s ease',
      position: 'relative',
    },
    loginButton: {
      backgroundColor: '#e85d04',
      color: 'white',
      padding: '0.65rem 2rem',
      borderRadius: '50px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(232, 93, 4, 0.3)',
      fontSize: '0.95rem',
      letterSpacing: '0.5px',
    },
    heroSection: {
      paddingTop: '88px',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    },
    heroImageWrapper: {
      width: '100%',
      height: '600px',
      overflow: 'hidden',
      position: 'relative',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(26, 36, 86, 0.3), rgba(26, 36, 86, 0.6))',
      zIndex: 1,
    },
    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: 'brightness(0.9)',
    },
    heroContent: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2,
      textAlign: 'center',
      color: 'white',
      width: '90%',
      maxWidth: '900px',
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
      lineHeight: '1.2',
    },
    heroSubtitle: {
      fontSize: '1.5rem',
      marginBottom: '2rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      fontWeight: '300',
      letterSpacing: '1px',
    },
    heroButton: {
      backgroundColor: '#e85d04',
      color: 'white',
      padding: '1rem 3rem',
      borderRadius: '50px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 6px 25px rgba(232, 93, 4, 0.4)',
      letterSpacing: '1px',
    },
    section: {
      padding: '5rem 2rem',
      backgroundColor: 'white',
    },
    sectionDark: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #1a2456 0%, #0f1736 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    },
    sectionOrange: {
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #f2833d 0%, #e85d04 100%)',
      color: 'white',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '4rem',
      alignItems: 'center',
    },
    heading: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#1a2456',
      marginBottom: '3rem',
      textAlign: 'center',
      position: 'relative',
      paddingBottom: '1rem',
    },
    headingUnderline: {
      width: '100px',
      height: '4px',
      backgroundColor: '#e85d04',
      margin: '0 auto',
      borderRadius: '2px',
    },
    headingWhite: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '2rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    subheading: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#1a2456',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    subheadingOrange: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#fbbf24',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    text: {
      color: '#4b5563',
      lineHeight: '1.8',
      fontSize: '1.05rem',
    },
    textWhite: {
      color: '#e5e7eb',
      lineHeight: '1.8',
      fontSize: '1rem',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    listItem: {
      display: 'flex',
      alignItems: 'start',
      marginBottom: '1rem',
      fontSize: '1rem',
      transition: 'transform 0.2s ease',
      padding: '0.5rem',
      borderRadius: '8px',
    },
    bullet: {
      marginRight: '1rem',
      marginTop: '0.25rem',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    sideImage: {
      width: '46vw',
      height: '520px',
      objectFit: 'cover',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    programCard: {
      padding: '2.5rem',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      color: 'white',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    programCardBlue: {
      background: 'linear-gradient(135deg, #1a2456 0%, #0f1736 100%)',
    },
    programCardOrange: {
      background: 'linear-gradient(135deg, #e85d04 0%, #dc2f02 100%)',
    },
    contactBox: {
      maxWidth: '768px',
      margin: '0 auto',
      backgroundColor: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(10px)',
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    footer: {
      backgroundColor: '#0f1736',
      color: '#d1d6df',
      padding: '2.5rem 1rem',
      textAlign: 'center',
    },
    decorativeShape: {
      position: 'absolute',
      borderRadius: '50%',
      opacity: 0.1,
    },
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div 
            style={styles.logoSection} 
            onClick={() => scrollToSection('home')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src={logo} alt="Logo" style={styles.logo} />
            <div>
              <h1 style={styles.universityName}>Annamalai University</h1>
              <p style={styles.accreditation}>Accredited with 'A+' grade by NAAC</p>
            </div>
          </div>
          
          <div style={styles.navLinks}>
            {['Home', 'About', 'Goals', 'Programmes', 'Contact'].map((item) => (
              <button 
                key={item}
                style={styles.navButton} 
                onClick={() => scrollToSection(item.toLowerCase())}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fbbf24';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {item === 'Programmes' ? 'Programme Offered' : item}
              </button>
            ))}
            <button 
              style={styles.loginButton} 
              onClick={handleLoginClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2f02';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(232, 93, 4, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e85d04';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(232, 93, 4, 0.3)';
              }}
            >
              Login
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" style={styles.heroSection}>
        <div style={styles.heroImageWrapper}>
          <div style={styles.heroOverlay}></div>
          <img src={adminImg} alt="Students" style={styles.heroImage} />
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Shaping Tomorrow's IT Leaders
            </h1>
            <p style={styles.heroSubtitle}>
              Excellence in Information Technology Education & Research
            </p>
            <button 
              style={styles.heroButton}
              onClick={() => scrollToSection('about')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2f02';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(232, 93, 4, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e85d04';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(232, 93, 4, 0.4)';
              }}
            >
              Explore More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={styles.section}>
        <div style={styles.container}>
          <div>
            <h2 style={styles.heading}>About Us</h2>
            <div style={styles.headingUnderline}></div>
          </div>
          
          <div style={{...styles.gridTwo, marginTop: '3rem'}}>
            <div>
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={styles.subheading}>
                  <span style={{fontSize: '2rem'}}>🎯</span>
                  Vision
                </h3>
                <p style={styles.text}>
                  "To produce globally competent, quality technocrats, to inculcate values of leadership and research qualities and to play a vital role in the socio-economic progress of the nation."
                </p>
              </div>

              <div>
                <h3 style={styles.subheading}>
                  <span style={{fontSize: '2rem'}}>🚀</span>
                  Mission
                </h3>
                <ul style={styles.list}>
                  {[
                    'To partner with the University community to understand the information technology needs of faculty, staff and students.',
                    'To develop dynamic IT professionals with globally competitive learning experience by providing high class education.',
                    'To involve graduates in understanding need based Research activities and disseminate the knowledge to develop entrepreneur skills.'
                  ].map((item, index) => (
                    <li 
                      key={index}
                      style={styles.listItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(10px)';
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={{...styles.bullet, color: '#e85d04'}}>•</span>
                      <span style={styles.text}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <img 
                src={itImg} 
                alt="About" 
                style={styles.sideImage}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section id="goals" style={styles.sectionDark}>
        {/* Decorative shapes */}
        <div style={{...styles.decorativeShape, width: '300px', height: '300px', backgroundColor: '#e85d04', top: '-100px', right: '-100px'}}></div>
        <div style={{...styles.decorativeShape, width: '200px', height: '200px', backgroundColor: '#fbbf24', bottom: '-50px', left: '-50px'}}></div>
        
        <div style={styles.container}>
          <div style={styles.gridTwo}>
            <div>
              <img 
                src={featImg} 
                alt="Goals" 
                style={{
      width: '100%',
      height: '520px',
      objectFit: 'cover',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02) rotate(1deg)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
              />
            </div>

            <div>
              <h2 style={styles.headingWhite}>Our Goals</h2>

              <div style={{ marginBottom: '3rem' }}>
                <h3 style={styles.subheadingOrange}>
                  <span style={{fontSize: '1.5rem'}}>⚡</span>
                  Short Term Goals
                </h3>
                <ul style={styles.list}>
                  {[
                    'To motivate faculty for Societal oriented Research.',
                    'To deliver best academics environment and infrastructure.',
                    'To create E-learning content and resources.',
                    'To organize centres for training Open Source Softwares.',
                    'To improve Industry Institute Interaction.',
                    'To provide computer literacy programs in rural areas.'
                  ].map((item, index) => (
                    <li 
                      key={index}
                      style={styles.listItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(10px)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={{...styles.bullet, color: '#4ade80'}}>✓</span>
                      <span style={styles.textWhite}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={styles.subheadingOrange}>
                  <span style={{fontSize: '1.5rem'}}>🎯</span>
                  Long Term Goals
                </h3>
                <ul style={styles.list}>
                  {[
                    'To excel in research & development activities with industries & research organizations.',
                    'To organize International Conference on Computational Intelligence.',
                    'To start certificate programs in collaboration with foreign universities.'
                  ].map((item, index) => (
                    <li 
                      key={index}
                      style={styles.listItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(10px)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={{...styles.bullet, color: '#fbbf24'}}>✓</span>
                      <span style={styles.textWhite}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section id="programmes" style={styles.section}>
        <div style={styles.container}>
          <div>
            <h2 style={styles.heading}>Programme Offered</h2>
            <div style={styles.headingUnderline}></div>
          </div>

          <div style={{...styles.gridTwo, maxWidth: '1024px', margin: '3rem auto 0'}}>
            <div 
              style={{...styles.programCard, ...styles.programCardBlue}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
              }}
            >
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🎓</div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                B.E. Information Technology
              </h3>
              <p style={{ marginBottom: '1rem', opacity: 0.9, fontWeight: '600', fontSize: '1.1rem' }}>
                (Full-time) - UG
              </p>
              <p style={{ fontSize: '1rem', opacity: 0.85, lineHeight: '1.6' }}>
                Comprehensive undergraduate program designed to build strong foundations in information technology and software development.
              </p>
            </div>

            <div 
              style={{...styles.programCard, ...styles.programCardOrange}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
              }}
            >
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔬</div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                Ph.D Information Technology
              </h3>
              <p style={{ marginBottom: '1rem', opacity: 0.9, fontWeight: '600', fontSize: '1.1rem' }}>
                Research
              </p>
              <p style={{ fontSize: '1rem', opacity: 0.85, lineHeight: '1.6' }}>
                Advanced research program for scholars seeking to contribute to cutting-edge developments in information technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.sectionOrange}>
        <div style={styles.container}>
          <div>
            <h2 style={{...styles.headingWhite, textAlign: 'center', marginBottom: '1rem'}}>
              Contact Us
            </h2>
            <div style={{...styles.headingUnderline, backgroundColor: 'white'}}></div>
          </div>

          <div style={{...styles.contactBox, marginTop: '3rem'}}>
            <div style={{fontSize: '3rem', textAlign: 'center', marginBottom: '1.5rem'}}>📧</div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
              The Professor and Head
            </h3>
            <div style={{ fontSize: '1rem', lineHeight: '2' }}>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', textAlign: 'center' }}>
                Department of Information Technology
              </p>
              <p style={{textAlign: 'center',fontSize: '1rem'}}>Faculty of Engineering & Technology</p>
              <p style={{textAlign: 'center'}}>Annamalai University</p>
              <p style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Annamalainagar - 608002</p>
              <div style={{ 
                borderTop: '2px solid rgba(255,255,255,0.3)', 
                paddingTop: '1.5rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <p style={{marginBottom: '0.75rem'}}><strong>📞 Tel Number:</strong> 04144-239733 & 239738</p>
                <p style={{marginBottom: '0.75rem'}}><strong>📱 Extension:</strong> 498</p>
                <p>
                  <strong>✉️ Email:</strong>{' '}
                  <a 
                    href="mailto:aufeatit@gmail.com" 
                    style={{ 
                      color: 'white', 
                      textDecoration: 'underline',
                      fontWeight: '600'
                    }}
                  >
                    aufeatit@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          &copy; 2025 Annamalai University. All rights reserved.
        </p>
        <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
          Department of Information Technology
        </p>
      </footer>
    </div>
  );
}