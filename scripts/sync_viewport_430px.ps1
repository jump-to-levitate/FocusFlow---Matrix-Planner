# Global Viewport Synchronization Script
# Converts 480px → 430px (Pro Max Standard) while preserving min-[480px]: breakpoints
# Usage: .\scripts\sync_viewport_430px.ps1

$ErrorActionPreference = 'Stop'

Write-Host "=== FOCUSFLOW VIEWPORT SYNCHRONIZATION (480px → 430px) ===" -ForegroundColor Cyan
Write-Host "Target files: Architecture, Business, Plans, Roles, Tech" -ForegroundColor Gray
Write-Host "Preserving: min-[480px]: breakpoints (desktop frame)" -ForegroundColor Green
Write-Host ""

# Files to process (based on audit results)
$targetFiles = @(
    "docs\architecture\adr_001.md",
    "docs\architecture\adr_002.md",
    "docs\architecture\system_overview.md",
    "docs\business\business_goals.md",
    "docs\business\glossary.md",
    "docs\roles\tester\strategia_testow.md",
    "docs\tech\tech_stack.md"
)

# Additional files from plans and strategy directories
$planFiles = Get-ChildItem -Path "docs\plans" -Filter "*.md" -Recurse | Select-Object -ExpandProperty FullName
$targetFiles += $planFiles

# Process each file
$processed = 0
$skipped = 0
$errors = @()

foreach ($file in $targetFiles) {
    $relativePath = $file -replace [regex]::Escape($PWD.Path + "\"), ""
    
    if (-not (Test-Path $file)) {
        Write-Host "SKIP: $relativePath (not found)" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    try {
        # Read content
        $content = Get-Content $file -Raw -Encoding UTF8
        $originalContent = $content
        
        # Check if file contains 480px references (excluding min-[480px]:)
        $has480px = $content -match '(?<!min-\[)480px(?!\]:)'
        
        if (-not $has480px) {
            Write-Host "SKIP: $relativePath (no 480px to convert)" -ForegroundColor Gray
            $skipped++
            continue
        }
        
        # Perform replacements (order matters!)
        
        # 1. max-w-[480px] → max-w-[430px]
        $content = $content -replace 'max-w-\[480px\]', 'max-w-[430px]'
        
        # 2. w-[480px] → w-[430px]
        $content = $content -replace 'w-\[480px\]', 'w-[430px]'
        
        # 3. max-w-480px → max-w-430px (without brackets)
        $content = $content -replace '\bmax-w-480px\b', 'max-w-430px'
        
        # 4. width: 480px → width: 430px
        $content = $content -replace 'width:\s*480px', 'width: 430px'
        
        # 5. Mobile-first 480px → mobile-first 430px Pro Max
        $content = $content -replace 'mobile-first\s+480px', 'mobile-first 430px Pro Max'
        
        # 6. 480px width → 430px Pro Max width
        $content = $content -replace '480px\s+width', '430px Pro Max width'
        
        # 7. width 480px → width 430px
        $content = $content -replace 'width\s+480px', 'width 430px'
        
        # 8. 480px Pro Max → 430px Pro Max (already correct, just in case)
        $content = $content -replace '480px\s+Pro\s+Max', '430px Pro Max'
        
        # 9. 480px constraint → 430px constraint
        $content = $content -replace '480px\s+constraint', '430px constraint'
        
        # 10. 480px standard → 430px standard
        $content = $content -replace '480px\s+standard', '430px standard'
        
        # 11. Generic 480px mentions (with context)
        $content = $content -replace '(?<!\[)\b480px\b(?!\])', '430px'
        
        # Write back only if changed
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
            $processed++
            Write-Host "OK:   $relativePath (converted 480px → 430px)" -ForegroundColor Green
        } else {
            $skipped++
            Write-Host "SKIP: $relativePath (no changes needed)" -ForegroundColor Gray
        }
        
    } catch {
        $errors += "$relativePath : $($_.Exception.Message)"
        Write-Host "ERR:  $relativePath ($($_.Exception.Message))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== SYNCHRONIZATION COMPLETE ===" -ForegroundColor Cyan
Write-Host "Processed: $processed files" -ForegroundColor Green
Write-Host "Skipped:   $skipped files" -ForegroundColor Yellow
Write-Host "Errors:    $($errors.Count)" -ForegroundColor $(if($errors.Count -gt 0){'Red'}else{'Green'})

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "ERRORS:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: git diff --stat" -ForegroundColor Gray
Write-Host "2. Review changes: git diff docs/" -ForegroundColor Gray
Write-Host "3. Stage and commit: git add -A && git commit -m 'fix(docs): Synchronize all viewport references to 430px Pro Max Standard'" -ForegroundColor Gray
