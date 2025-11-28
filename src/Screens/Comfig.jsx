import { IoIosColorPalette } from 'react-icons/io'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSettings, FiUser, FiBell, FiShield, FiSave, FiRotateCcw } from 'react-icons/fi'
import Header from '../Components/Header'
const Config = () => {
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      idioma: 'es',
      tema: 'claro',
      zonaHoraria: 'UTC-3',
    },
    cuenta: {
      nombre: 'Usuario Ejemplo',
      email: 'usuario@ejemplo.com',
      twoFactor: false,
      visibilidad: 'publico',
    },
    notificaciones: {
      email: true,
      push: true,
      sonido: false,
      newsletter: true,
    },
    privacidad: {
      perfilPublico: true,
      mostrarEmail: false,
      aceptarMensajes: true,
      historialActividad: true,
    },
    apariencia: {
      densidad: 'comfortable',
      tamañoFuente: 'medio',
      animaciones: true,
    },
  })

  const [saved, setSaved] = useState(false)

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setSettings({
      general: {
        idioma: 'es',
        tema: 'claro',
        zonaHoraria: 'UTC-3',
      },
      cuenta: {
        nombre: 'Usuario Ejemplo',
        email: 'usuario@ejemplo.com',
        twoFactor: false,
        visibilidad: 'publico',
      },
      notificaciones: {
        email: true,
        push: true,
        sonido: false,
        newsletter: true,
      },
      privacidad: {
        perfilPublico: true,
        mostrarEmail: false,
        aceptarMensajes: true,
        historialActividad: true,
      },
      apariencia: {
        densidad: 'comfortable',
        tamañoFuente: 'medio',
        animaciones: true,
      },
    })
    setSaved(false)
  }

  const menuItems = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'cuenta', label: 'Cuenta', icon: FiUser },
    { id: 'notificaciones', label: 'Notificaciones', icon: FiBell },
    { id: 'privacidad', label: 'Privacidad', icon: FiShield },
    { id: 'apariencia', label: 'Apariencia', icon: IoIosColorPalette },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-6xl"
        >
          {/* Header Mejorado */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <motion.h1
              className="mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-4xl font-bold text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Configuraciones
            </motion.h1>
            <p className="text-lg text-purple-200 opacity-90">
              Personaliza tu experiencia según tus preferencias
            </p>
          </motion.div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Navigation Mejorado */}
            <motion.div
              variants={cardVariants}
              className="h-fit rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg lg:w-80"
            >
              <nav className="space-y-3">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 transition-all duration-300 ${
                        activeSection === item.id
                          ? 'border border-white/30 bg-white/20 text-white shadow-lg'
                          : 'text-purple-100 hover:bg-white/10 hover:text-white'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Icon
                        className={`h-5 w-5 ${activeSection === item.id ? 'text-white' : 'text-purple-300'}`}
                      />
                      <span className="font-semibold">{item.label}</span>
                    </motion.button>
                  )
                })}
              </nav>
            </motion.div>

            {/* Main Content Mejorado */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex-1"
            >
              <motion.div
                variants={cardVariants}
                className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg"
              >
                <AnimatePresence mode="wait">
                  {activeSection === 'general' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                        <FiSettings className="h-7 w-7 text-purple-300" />
                        Configuración General
                      </h2>

                      <div className="grid gap-6">
                        <motion.div variants={itemVariants} className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-200">
                            Idioma
                          </label>
                          <select
                            value={settings.general.idioma}
                            onChange={e => handleInputChange('general', 'idioma', e.target.value)}
                            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-purple-300 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                          >
                            <option value="es" className="bg-slate-800">
                              Español
                            </option>
                            <option value="en" className="bg-slate-800">
                              English
                            </option>
                            <option value="pt" className="bg-slate-800">
                              Português
                            </option>
                          </select>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-200">
                            Tema
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            {['claro', 'oscuro'].map(tema => (
                              <motion.label
                                key={tema}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-4 text-white transition-all hover:bg-white/10"
                              >
                                <input
                                  type="radio"
                                  name="tema"
                                  value={tema}
                                  checked={settings.general.tema === tema}
                                  onChange={e =>
                                    handleInputChange('general', 'tema', e.target.value)
                                  }
                                  className="text-purple-400 focus:ring-purple-400"
                                />
                                <span className="font-medium capitalize">{tema}</span>
                              </motion.label>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-200">
                            Zona Horaria
                          </label>
                          <select
                            value={settings.general.zonaHoraria}
                            onChange={e =>
                              handleInputChange('general', 'zonaHoraria', e.target.value)
                            }
                            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-purple-300 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                          >
                            <option value="UTC-3" className="bg-slate-800">
                              UTC-3 (Argentina)
                            </option>
                            <option value="UTC-5" className="bg-slate-800">
                              UTC-5 (México)
                            </option>
                            <option value="UTC-6" className="bg-slate-800">
                              UTC-6 (Centroamérica)
                            </option>
                          </select>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'cuenta' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                        <FiUser className="h-7 w-7 text-purple-300" />
                        Configuración de Cuenta
                      </h2>

                      <div className="grid gap-6">
                        <motion.div variants={itemVariants} className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-200">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={settings.cuenta.nombre}
                            onChange={e => handleInputChange('cuenta', 'nombre', e.target.value)}
                            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-purple-300 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                            placeholder="Ingresa tu nombre"
                          />
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-200">
                            Email
                          </label>
                          <input
                            type="email"
                            value={settings.cuenta.email}
                            onChange={e => handleInputChange('cuenta', 'email', e.target.value)}
                            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-purple-300 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                            placeholder="tu@email.com"
                          />
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm"
                        >
                          <div>
                            <h3 className="font-semibold text-white">
                              Autenticación de dos factores
                            </h3>
                            <p className="text-sm text-purple-200">
                              Mayor seguridad para tu cuenta
                            </p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={settings.cuenta.twoFactor}
                              onChange={e =>
                                handleInputChange('cuenta', 'twoFactor', e.target.checked)
                              }
                              className="peer sr-only"
                            />
                            <div className="peer h-7 w-12 rounded-full bg-gray-600 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-400/50 after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                          </label>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'notificaciones' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                        <FiBell className="h-7 w-7 text-purple-300" />
                        Configuración de Notificaciones
                      </h2>

                      <div className="space-y-4">
                        {Object.entries(settings.notificaciones).map(([key, value], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm"
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-white capitalize">
                                {key === 'email' && 'Notificaciones por Email'}
                                {key === 'push' && 'Notificaciones Push'}
                                {key === 'sonido' && 'Sonido de Notificaciones'}
                                {key === 'newsletter' && 'Boletín Informativo'}
                              </h3>
                              <p className="mt-1 text-sm text-purple-200">
                                {key === 'email' && 'Recibir notificaciones por correo electrónico'}
                                {key === 'push' && 'Notificaciones en tiempo real en el navegador'}
                                {key === 'sonido' && 'Reproducir sonido al recibir notificaciones'}
                                {key === 'newsletter' && 'Recibir novedades y actualizaciones'}
                              </p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={e =>
                                  handleInputChange('notificaciones', key, e.target.checked)
                                }
                                className="peer sr-only"
                              />
                              <div className="peer h-7 w-12 rounded-full bg-gray-600 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-400/50 after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Secciones de Privacidad y Apariencia con el mismo estilo mejorado */}
                  {activeSection === 'privacidad' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                        <FiShield className="h-7 w-7 text-purple-300" />
                        Configuración de Privacidad
                      </h2>
                      <div className="space-y-4">
                        {Object.entries(settings.privacidad).map(([key, value], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm"
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-white capitalize">
                                {key === 'perfilPublico' && 'Perfil Público'}
                                {key === 'mostrarEmail' && 'Mostrar Email'}
                                {key === 'aceptarMensajes' && 'Aceptar Mensajes'}
                                {key === 'historialActividad' && 'Historial de Actividad'}
                              </h3>
                              <p className="mt-1 text-sm text-purple-200">
                                {key === 'perfilPublico' && 'Hacer tu perfil visible para todos'}
                                {key === 'mostrarEmail' && 'Mostrar tu email en el perfil'}
                                {key === 'aceptarMensajes' && 'Permitir mensajes de otros usuarios'}
                                {key === 'historialActividad' && 'Guardar historial de actividad'}
                              </p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={e =>
                                  handleInputChange('privacidad', key, e.target.checked)
                                }
                                className="peer sr-only"
                              />
                              <div className="peer h-7 w-12 rounded-full bg-gray-600 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-400/50 after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'apariencia' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                        <IoIosColorPalette className="h-7 w-7 text-purple-300" />
                        Configuración de Apariencia
                      </h2>
                      <div className="grid gap-6">
                        <motion.div variants={itemVariants} className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-200">
                            Densidad de la Interfaz
                          </label>
                          <div className="grid grid-cols-3 gap-4">
                            {['compacto', 'comfortable', 'espaciado'].map(densidad => (
                              <motion.label
                                key={densidad}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-4 text-white transition-all hover:bg-white/10"
                              >
                                <input
                                  type="radio"
                                  name="densidad"
                                  value={densidad}
                                  checked={settings.apariencia.densidad === densidad}
                                  onChange={e =>
                                    handleInputChange('apariencia', 'densidad', e.target.value)
                                  }
                                  className="text-purple-400 focus:ring-purple-400"
                                />
                                <span className="font-medium capitalize">{densidad}</span>
                              </motion.label>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-200">
                            Tamaño de Fuente
                          </label>
                          <select
                            value={settings.apariencia.tamañoFuente}
                            onChange={e =>
                              handleInputChange('apariencia', 'tamañoFuente', e.target.value)
                            }
                            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-purple-300 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                          >
                            <option value="pequeño" className="bg-slate-800">
                              Pequeño
                            </option>
                            <option value="medio" className="bg-slate-800">
                              Medio
                            </option>
                            <option value="grande" className="bg-slate-800">
                              Grande
                            </option>
                          </select>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm"
                        >
                          <div>
                            <h3 className="font-semibold text-white">Animaciones</h3>
                            <p className="text-sm text-purple-200">
                              Habilitar transiciones y efectos
                            </p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={settings.apariencia.animaciones}
                              onChange={e =>
                                handleInputChange('apariencia', 'animaciones', e.target.checked)
                              }
                              className="peer sr-only"
                            />
                            <div className="peer h-7 w-12 rounded-full bg-gray-600 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-400/50 after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                          </label>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons Mejorados */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 flex justify-end gap-4 border-t border-white/20 pt-6"
                >
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-white/10"
                  >
                    <FiRotateCcw className="h-4 w-4" />
                    Restablecer
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700"
                  >
                    <FiSave className="h-4 w-4" />
                    {saved ? '¡Guardado!' : 'Guardar Cambios'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Config
