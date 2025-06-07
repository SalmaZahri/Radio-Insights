//verifier si l'utilisateur est connecter
export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };