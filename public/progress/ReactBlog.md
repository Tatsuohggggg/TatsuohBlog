![thumbnail](/public/image/ReactBlogThumbnail.png)

github pagesをカスタムドメインを使用して作成したので、制作備忘録として手順や使用サービスについてまとめておきます。

## 開発環境
- node.js v20.14.0
- npm 10.8.1

## 実装手順
おおまかな実装の流れは以下の通りです。
1. ReactJSXでSPA作成
2. cloudflareでドメイン取得　DNS設定
3. github pagesでデプロイ

## 1.ReactJSXでSPA作成
記事をコンスタントに更新するのに必要なのは、アップロードの簡単さですね。  
そのため、mdファイルを上げるだけで更新が完了するよう、実装を進めました。  
結局、記事の更新毎にmdファイルを管理するjsonに記事のパスを追加する手間ができてしまったのですが、おおむね想定通りの簡便さになりました。

```js
//jsonを読み込んで該当する記事の情報を見つける
const fetchJsonIndex = async () => {
        try {
            let path;
            let filename;
            if (props.link === "/GameDiary") {
                path = "/markdown.json";
                filename = "/articles";
            }
            else if (props.link === "/Progress") {
                path = "/progressindex.json";
                filename = "/progress";
            }
            else if(props.link === "/Nikki") {
                path = "/nikki.json";
                filename = "/nikki";
            }

            //markdown.jsonから、pathと同じtitleを含む要素番号を探す
            //console.log(path);
            const response = await fetch(`${process.env.PUBLIC_URL}${path}`);
            console.log(response);
            const data = await response.json();
            const articleIndex = data.articles.findIndex(item => item.path === distination);
            if (articleIndex !== -1) {
                fetchJsonData(`${filename}${data.articles[articleIndex].link}`);
                setTitle(data.articles[articleIndex].title);
            }
            //指定した要素番号のlinkを読み込んで、記事をセットする
        } catch (error) {
            setError(error.message);
            console.error('Error fetching article:', error);
        }
    };

    //記事のmdファイルの内容をstringに変換する
    const fetchJsonData = async (path) => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}${path}`);
            const text = await response.text();
            setMarkdown(text);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching JSON data:', error);
        }
    };

    useEffect(() => {
        // 記事データのインデックスを取得する
        fetchJsonIndex();
    }, []);
```

大方の実装はこんな感じ。記事へのリンクがクリックされたら、クリックされたリンクがどこを指すのかjsonと照らし合わせて確認(fetchJsonIndex())し、確認ができたらそのインデックスのmdをstringに変換する(fetchJsonData())という流れです。  
フックがまだ理解しきれていない実感があるので、もう少しブラッシュアップできそうなところはたくさんあるのですが、取り急ぎサイトを作っておきたかったので今回はこんな感じで。  
実は3年ほど前にも同じような取り組みをしたのですが、ブラッシュアップに時間をかけすぎてデプロイに取り掛かれない呪いのようなものを患いました。  
なにはともあれとりあえず形にするというのは大事ということを学んだので、今回はさっさと上げちゃいます。ブラッシュアップは後からでもできるんじゃ。  

## 2.cloudflareでドメイン取得　DNS設定
初めてドメインを取得しました。  
あまりドメインにこだわりはなかったのですが、友人らのブログがみんな個人ドメインだったのを見てそこはかとないかっこよさを感じたため、急遽取得することになりました。  
ドメインの取得はcloudflare。  
お名前.comだけはやめておけという話をよく見かけるのでそれだけは回避しての選択です。それ以外にこだわりはありませんでしたが、ドメイン取得から各種設定までひとまとめにできたので、結果的にとてもいい選択だったと思います。  
まあ円安の極みみたいなタイミングでのドメイン取得だったので、お財布にはだいぶ痛手だったのですが。
  
### DNS設定
github pagesでカスタムドメインを設定する場合のDNS設定について書いておきます。  
DNS管理画面で、以下のようにDNSレコードを追加します。  
![dnsmanager](/public/image/dnsmanager.png)
タイプAの名前には取得したドメイン名を入力、CNAMEのコンテンツ欄にはgithubpagesとして使用する自身のリポジトリ名を入力します。(リポジトリ名に大文字がある場合、ここでは小文字に置き換えられてしまうが大丈夫ぽい)  

次に、SSL/TLSタブのSSL証明書に移動し、"常にHTTPSを使用"と"HTTPS の自動リライト"をアクティブにします。  
![alwaysusehttps](/public/image/always_use_the_https.PNG)
![auto_rewrite_to_https](/public/image/auto_rewrite_of_https.PNG)
cloudflare公式ブログによると、この設定でセキュリティホールの発生を抑えられるようです。マストじゃないけどやったほうがいいタイプか。もう少し調べてみます。

cloudflareでの操作はこんな感じでした。この通りにやったらgithubpagesでの証明書の発行がうまく行かず、CNAMEのプロキシを一度外したらうまくいったので、駄目だった場合はやってみるといいかも。

### github pagesでデプロイ
比較的簡単です。プロジェクトに"gh-pages"をインストールして、package.jsonのhomepageに設定したいカスタムドメインを入力するだけ。
![packagejson](/public/image/packagejson.png)
あとはターミナルで```npm run deploy```と入力すれば、接続しているリモートリポジトリ内にgh-pagesというブランチが生成されて、変更内容がプッシュされます。  
また、githubのsetting->Pages内でデプロイするブランチをgh-pagesに変更することと、カスタムドメインを取得したドメイン名に変更することを忘れずに。
![githubsettings](/public/image/githubsettings.png)



## 最後に
先述のとおり、ドメイン周りは初めて触った分野だったことで勉強することが多かったのですが、とりあえずうまくサイト構築に漕ぎつけられて一安心といったところです。  
コードについても十割手探りでの実装だったので、ブラッシュアップできるところは数多くあると思います。  
当面の課題はmdを管理するためのjsonの自動生成ですね。  
時間があったらやってみようと思います。  

以上。