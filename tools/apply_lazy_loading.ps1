$files = Get-ChildItem "d:\actionaire deplyed - Copy\*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    $pattern = '(?i)<img\s+([^>]+)>'
    
    $evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
        param($match)
        $imgTag = $match.Value
        $inner = $match.Groups[1].Value
        
        # Check if it already has loading="lazy"
        if ($inner -match '(?i)loading\s*=\s*["'']lazy["'']') {
            return $imgTag
        }
        
        # Exclude critical images from lazy loading (Hero headers, logos, preloaders)
        if ($inner -match '(?i)jarallax-img' -or 
            $inner -match '(?i)hero-bg' -or 
            $inner -match '(?i)aa-logo__img' -or 
            $inner -match '(?i)logo\.webp' -or 
            $inner -match '(?i)preloader\.gif') {
            return $imgTag
        }
        
        # Inject loading="lazy"
        return "<img loading=`"lazy`" $inner>"
    }
    
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $evaluator)
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    }
}
write-host "Automated Lazy Loading applied successfully."
