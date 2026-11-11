# CareerNote

HTML + Tailwind CSS のフロントエンドと、Java 11 / Spring Boot の JSON API で構成した就職活動支援デモです。画面部品は `src/components/atoms`、`molecules`、`organisms`、`src/templates`、`src/pages` に分けています。

## 起動方法

1. Java 11 と Maven 3.6.3 以降を用意します。
2. 依存関係を復元し、Java API を起動します。

   ```powershell
   mvn spring-boot:run
   ```

3. 別のターミナルでフロントエンドを起動します。

   ```powershell
   corepack pnpm install
   corepack pnpm dev
   ```

4. Vite の表示 URL を開きます。`/api` は `localhost:8080` の Spring Boot API にプロキシされます。

Java API が起動していない場合も画面を確認でき、その状態は「ブラウザー内デモモード」として表示されます。デモモードでは変更をブラウザーの `localStorage` に保存します。Java API 使用時のデータはメモリー上に保持され、サーバー再起動で初期化されます。

アカウント画面は UI 確認用で、実際の認証やパスワード保存は行いません。
