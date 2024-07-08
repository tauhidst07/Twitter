export const updateTheme = (language) => {
    switch (language) {
      case 'en':
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
        break;
      case 'es':
        document.body.style.backgroundColor = '#ffebcc';
        document.body.style.color = '#000000';
        break;
      case 'hi':
        document.body.style.backgroundColor = '#e0f7fa';
        document.body.style.color = '#000000';
        break;
      case 'pt':
        document.body.style.backgroundColor = '#fff3e0';
        document.body.style.color = '#000000';
        break;
      case 'ta':
        document.body.style.backgroundColor = '#e8f5e9';
        document.body.style.color = '#000000';
        break;
      case 'bn':
        document.body.style.backgroundColor = '#f3e5f5';
        document.body.style.color = '#000000';
        break;
      case 'fr':
        document.body.style.backgroundColor = '#f0f4c3';
        document.body.style.color = '#000000';
        break;
      default:
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
    }
  };