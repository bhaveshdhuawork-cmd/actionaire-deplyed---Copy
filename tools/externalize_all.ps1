$files = Get-ChildItem "d:\actionaire deplyed - Copy\*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # 1. Add global links (if not present)
    if ($content -notmatch "global-ui.css") {
        $linkGlobal = '    <link href="css/global-ui.css" rel="stylesheet" type="text/css">' + "`r`n"
        $linkElements = '    <link href="css/ui-elements.css" rel="stylesheet" type="text/css">' + "`r`n"
        
        # Insert after coloring.css or scheme-01.css
        if ($content -match 'href="css/colors/scheme-01.css" rel="stylesheet" type="text/css">') {
            $content = $content -replace '(href="css/colors/scheme-01.css" rel="stylesheet" type="text/css">)', "`$1`r`n$linkGlobal$linkElements"
        } elseif ($content -match 'href="css/coloring.css" rel="stylesheet" type="text/css">') {
            $content = $content -replace '(href="css/coloring.css" rel="stylesheet" type="text/css">)', "`$1`r`n$linkGlobal$linkElements"
        }
    }

    # 2. Add page specific links
    if ($file.Name -eq "home.html" -and $content -notmatch "home-ui.css") {
        $content = $content -replace '(css/ui-elements.css" rel="stylesheet" type="text/css">)', "`$1`r`n    <link href=""css/home-ui.css"" rel=""stylesheet"" type=""text/css"">"
    }
    if ($file.Name -eq "bldc.html" -and $content -notmatch "bldc.css") {
        $content = $content -replace '(css/ui-elements.css" rel="stylesheet" type="text/css">)', "`$1`r`n    <link href=""css/bldc.css"" rel=""stylesheet"" type=""text/css"">"
    }

    # 3. Remove Redundant Style Blocks
    
    # Remove header/nav block (regex for block starting with :root and containing --aa-black)
    $content = [regex]::Replace($content, '(?s)\s*<style>.*?:root\s*\{.*?--aa-black:.*?</style>', "")
    
    # Remove preloader block
    $content = [regex]::Replace($content, '(?s)\s*<style>.*?#de-loader\s*\{.*?</style>', "")
    
    # Remove product detail block (size-btn, gallery)
    $content = [regex]::Replace($content, '(?s)\s*<style>.*?\.size-btn\s*\{.*?</style>', "")
    
    # Remove manufacturing excellence block (if any left)
    $content = [regex]::Replace($content, '(?s)\s*<style>.*?\.interactive-mfg\s*\{.*?</style>', "")

    # Remove marquee block (if any left)
    $content = [regex]::Replace($content, '(?s)\s*<style>.*?\.client-showcase\s*\{.*?</style>', "")

    # Save content
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

write-host "Project-wide CSS externalization complete."
