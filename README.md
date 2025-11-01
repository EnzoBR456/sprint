Integrantes:
Enzo dos Santos Beserra RM 552340
Thiago Shiromoto Sardinha RM 98483
Vitor Hugo Ferreira de Andrade RM 99635

Instruções para rodar:
Docker compose MySQL:

É preciso que comece a iniciar o projeto pelo banco docker , primeiro já tenha instalado o docker desktop, depois Utilize "docker compose up -d" no Terminal do Backend para subir o banco

Dependências que precisam ser instaladas:
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/native-stack

depois no terminal você digita:  npx expo start
e aperta W(para emular no web)

Instruções para rodar backend e frontend em conjunto:
rode primeiro o Backend, basta clicar no arquivo BackendApplication e depois clicar no símbolo de play que fica no superior direito e depois rode o Frontend usando o npx expo start, assim eles funcionaram devidamente, no frontend use o web para abrir o aplicativo.

Como rodar
Backend: mvn spring-boot:run

Frontend: npm install 
npx react-native run-android`

