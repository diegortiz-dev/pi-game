// O AsyncStorage é um módulo nativo; nos testes usa-se o mock em memória que o
// próprio pacote publica.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
