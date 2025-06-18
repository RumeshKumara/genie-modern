import styled from 'styled-components';

export const SignInWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;

  .logo {
    margin-bottom: 2rem;
    width: 120px;
    height: auto;
  }

  .cl-card {
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    background: white;
    padding: 2.5rem;
    width: 100%;
    max-width: 400px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4f46e5, #6366f1);
      border-radius: 16px 16px 0 0;
    }
  }

  .cl-header {
    text-align: center;
    margin-bottom: 2rem;

    h1 {
      font-size: 1.5rem;
      color: #111827;
      font-weight: 600;
    }
  }

  .cl-button {
    background: #4f46e5;
    transition: all 0.2s ease;
    font-weight: 500;
    height: 42px;

    &:hover {
      background: #4338ca;
      transform: translateY(-1px);
    }
  }

  .cl-formButtonPrimary {
    width: 100%;
    margin-top: 1.5rem;
  }

  .cl-dividerText {
    color: #6b7280;
  }

  .cl-dividerLine {
    background: #e5e7eb;
  }

  .cl-footerAction {
    color: #6b7280;
    margin-top: 1.5rem;

    a {
      color: #4f46e5;
      font-weight: 500;

      &:hover {
        color: #4338ca;
      }
    }
  }

  .cl-socialButtonsBlockButton {
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;

    &:hover {
      border-color: #4f46e5;
      background: #f9fafb;
    }
  }

  .cl-formFieldInput {
    border-color: #e5e7eb;
    padding: 0.75rem 1rem;
    transition: all 0.2s ease;

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 1px #4f46e5;
    }
  }
`;