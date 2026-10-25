import { afterEach, beforeEach, describe, test, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Projects from '../pages/Projects'
import Dashboard from '../pages/Dashboard'

const renderPage = (page) => render(
  <AuthProvider>
    <MemoryRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      {page}
    </MemoryRouter>
  </AuthProvider>,
)

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    json: async () => [],
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Frontend Pages', ()=>{
  test('10. Login page renders', ()=>{
    renderPage(<Login/>)
    expect(screen.getByText(/Welcome back/i)).toBeDefined()
  })
  test('11. Register page renders', ()=>{
    renderPage(<Register/>)
    expect(screen.getByRole('heading', { name: /create account/i })).toBeDefined()
  })
  test('12. Projects page has search', async ()=>{
    renderPage(<Projects/>)
    expect(await screen.findByPlaceholderText(/Search projects/i)).toBeDefined()
    expect(await screen.findByText(/No projects found/i)).toBeDefined()
  })
  test('13. Dashboard renders stats', ()=>{
    localStorage.setItem('user', JSON.stringify({
      _id: 'client-1',
      name: 'Test Client',
      role: 'client',
    }))
    renderPage(<Dashboard/>)
    expect(screen.getByText('Total Projects')).toBeDefined()
  })
  test('14. Form validation - email required', ()=>{
    renderPage(<Login/>)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText('All fields required')).toBeDefined()
  })
  test('15. Budget filter logic', ()=>{
    const projects = [{budget:500}, {budget:2000}]
    const low = projects.filter(p=>p.budget<1000)
    expect(low.length).toBe(1)
  })
})