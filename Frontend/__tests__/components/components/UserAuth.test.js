describe('UserAuth Component', () => {
    test('should render login form initially', () => {
      const wrapper = shallow(<UserAuth />);
      expect(wrapper.find('[data-testid="login-form"]')).toHaveLength(1);
      expect(wrapper.find('[data-testid="register-form"]')).toHaveLength(0);
    });
  
    test('should switch to registration form when register button is clicked', () => {
      const wrapper = shallow(<UserAuth />);
      wrapper.find('[data-testid="switch-to-register"]').simulate('click');
      expect(wrapper.find('[data-testid="register-form"]')).toHaveLength(1);
      expect(wrapper.find('[data-testid="login-form"]')).toHaveLength(0);
    });
  
    test('should call login API with correct credentials on form submission', async () => {
      const mockLogin = jest.fn().mockResolvedValue({ success: true });
      const wrapper = mount(<UserAuth loginUser={mockLogin} />);
      
      wrapper.find('[data-testid="email-input"]').simulate('change', { target: { value: 'test@example.com' } });
      wrapper.find('[data-testid="password-input"]').simulate('change', { target: { value: 'password123' } });
      wrapper.find('[data-testid="login-form"]').simulate('submit');
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'noumannawaz2004@gmail.com',
          password: 'Nouman2k4'
        });
      });
    });
  });