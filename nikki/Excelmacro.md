この間起きたバイト先でのやり取り。

上司「たつおくんこのデータエクセルにまとめといて」

ぼく「マクロを組んで半自動化しておきました！今度からはみんな簡単にできます」

上司「たつおくんこのファイルウイルスに感染してるかもって出て開けないんだけど何かした？」

ぼく「(マクロ組んだからなぁ...)」

これを友人に話したら、マクロを含むエクセルファイルは拡張子が xlsm になること、xlsx ファイルでもマクロを動かすことはできることを知った(イマサラタウン)ので、試しにやってみました。

# マクロは別のブックで組む

前述のとおり、エクセルファイルには拡張子が`.xlsx`のものと、マクロを含む`.xlsm`の 2 種類があります。マクロは主に Excel での作業効率化を図るための便利機能ですが、悪意あるユーザーによってマルウェアを仕込まれる可能性があるので、xlsm ファイルを開く際には警告がでます。

出どころが分かっていればマルウェアを開いてしまう心配もないですが、今回のように共有ファイルにマクロを組むと、ブックを開く際に警告文が出て仕事相手をヒヤッとさせることもあり得るのでマクロは別ファイルに作成するのが無難そう。

というわけで、データファイル.xlsx とデータ抽出.xlsm ファイルに分けて、データ抽出にて作ったマクロをデータファイルで呼び出して使います。

まずはデータファイル。適当ですが、データそのものが A 列、データのタイプが B 列にあります。  
![contentimage](/datafile.png)

マクロはこんな感じ。読まなくて大丈夫です。今回はタイプが kani のデータのみを抽出してみます。

```VBA
Sub ExtractBgRows()
    Dim wsSource As Worksheet
    Dim wsTarget As Worksheet
    Dim sourceLastRow As Long

    Dim i As Long

    ' 指定変数

    Dim sourceType As String ' 検索条件のソースタイプ
    Dim sourceTypeColumn As String ' 検索条件のソースタイプがある行
    Dim sourceTargetColumn As String ' 抽出するソースがある行
    Dim writeColumn As String ' 書き出す行
    Dim initialWriteRow As Long ' 書き出す初期列

    sourceType = "kani"
    sourceTypeColumn = "B"
    sourceTargetColumn = "A"
    writeColumn = "B"
    initialWriteRow = 2


    ' シートの設定
    Set wsSource = Workbooks.Open("データファイル.xlsx").Sheets("Sheet1") ' データがあるブックのPathとシート名を指定
    Set wsTarget = Workbooks.Open("データファイル.xlsx").Sheets("Sheet2")  ' データを書き出すブックのPathとシート名を指定

    ' 抽出タイプのある最終行を取得
    sourceLastRow = wsSource.Cells(wsSource.Rows.Count, ColumnName2Idx(sourceTypeColumn)).End(xlUp).Row


    ' データの抽出
    For i = 1 To sourceLastRow
        If wsSource.Cells(i, ColumnName2Idx(sourceTypeColumn)).Value = sourceType Then ' Cellsの第二引数に抽出条件のTypeがある行を指定　抽出するTypeをValueに代入
            wsTarget.Cells(initialWriteRow, ColumnName2Idx(writeColumn)).Value = wsSource.Cells(i, ColumnName2Idx(sourceTargetColumn)).Value
            initialWriteRow = initialWriteRow + 1
        End If
    Next i

    MsgBox "データ抽出終了", vbInformation
End Sub

Function ColumnName2Idx(ByVal colName As String) As Long
    ColumnName2Idx = Columns(colName).Column
End Function
```

マクロでターゲットするブックを xlsx ファイルに指定することに注意。

抽出の際には、xlsm ファイルと xlsx ファイルをどちらも開いた状態にして、xlsx ファイルの開発タブ>マクロを開くと、作ったマクロが実行できます。

無事抽出が出来ました。
![contentimage](/extractdataresult.png)

あとはデータの抽出が完了したファイルを上司に叩きつけて完了です。

エラーが出なくてよかったね。上司ちゃん。

以上。
