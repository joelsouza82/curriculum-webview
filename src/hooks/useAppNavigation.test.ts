import { renderHook } from '@testing-library/react';
import { useAppNavigation } from './useAppNavigation';
import { clearSession } from '../services/authService';

const push = jest.fn();
const replace = jest.fn();
const back = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace, back }),
}));

jest.mock('../services/authService', () => ({
  clearSession: jest.fn(),
}));

describe('useAppNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('goToHome pushes /home with loginId', () => {
    const { result } = renderHook(() => useAppNavigation());
    result.current.goToHome('7');
    expect(push).toHaveBeenCalledWith('/home?loginId=7');
  });

  it('goToPersonal pushes /personal with loginId', () => {
    const { result } = renderHook(() => useAppNavigation());
    result.current.goToPersonal('7');
    expect(push).toHaveBeenCalledWith('/personal?loginId=7');
  });

  it('goToSearch pushes /personal/search with loginId', () => {
    const { result } = renderHook(() => useAppNavigation());
    result.current.goToSearch('7');
    expect(push).toHaveBeenCalledWith('/personal/search?loginId=7');
  });

  it('goToUpdate pushes /personal/update with loginId', () => {
    const { result } = renderHook(() => useAppNavigation());
    result.current.goToUpdate('7');
    expect(push).toHaveBeenCalledWith('/personal/update?loginId=7');
  });

  it('goToCreate pushes /personal/create with loginId', () => {
    const { result } = renderHook(() => useAppNavigation());
    result.current.goToCreate('7');
    expect(push).toHaveBeenCalledWith('/personal/create?loginId=7');
  });

  it('goToDelete pushes /personal/delete with loginId', () => {
    const { result } = renderHook(() => useAppNavigation());
    result.current.goToDelete('7');
    expect(push).toHaveBeenCalledWith('/personal/delete?loginId=7');
  });

  it('goBack calls router.back', () => {
    const { result } = renderHook(() => useAppNavigation());
    result.current.goBack();
    expect(back).toHaveBeenCalled();
  });

  it('logout clears the session and replaces with /', () => {
    const { result } = renderHook(() => useAppNavigation());
    result.current.logout();
    expect(clearSession).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/');
  });
});
