<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json');

// ========================
// Helper Functions
// ========================

// Функция за генериране на slug от заглавие
function slugify($title) {
    $title = preg_replace('/[^a-z0-9]+/i', '-', strtolower($title));
    $title = trim($title, '-');
    return $title ?: 'job';
}

// Функция за генериране на HTML страница за позиция
function generateCareerPage($job, $lang) {
    $slug = slugify($job['title']);
    $filename = "careers-job-{$slug}.html";
    
    $htmlLang = $lang === 'bg' ? 'bg' : 'en';
    $bodyClass = $lang === 'bg' ? 'lang-bg' : 'lang-en';
    
    // Текстове според езика
    $backLink = $lang === 'bg' ? '← Всички позиции' : '← All positions';
    $responsibilitiesTitle = $lang === 'bg' ? 'Ролята' : 'The Role';
    $requirementsTitle = $lang === 'bg' ? 'Изисквания' : 'Requirements';
    $niceToHaveTitle = $lang === 'bg' ? 'Допълнително предимство' : 'Nice to have';
    $offerTitle = $lang === 'bg' ? 'Какво предлагаме' : 'What We Offer';
    $applyNote = $lang === 'bg' ? 'Ако се разпознавате в това описание и бихте искали да се присъедините към екипа, моля изпратете кандидатура с актуално CV и очаквана заплата на:' : 'If this sounds like you and you\'d like to join our team, please send your application with CV and salary expectations to:';
    $confidentialNote = $lang === 'bg' ? 'Всички кандидатури са поверителни. Свързваме се само с одобрените кандидати за интервю.' : 'All applications are confidential. We will contact only shortlisted candidates.';
    
    $html = '<!DOCTYPE html>
<html lang="' . $htmlLang . '">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="' . htmlspecialchars($job['title']) . ' - ' . htmlspecialchars($job['location']) . '">
    <title>ITRB — ' . htmlspecialchars($job['title']) . '</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .careers-job-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 80px 0 60px;
            color: white;
        }
        .careers-back {
            display: inline-block;
            margin-bottom: 24px;
            color: #94a3b8;
            text-decoration: none;
        }
        .careers-back:hover {
            color: white;
        }
        .careers-job-title {
            font-size: 2.5rem;
            margin-bottom: 16px;
        }
        .careers-job-meta {
            color: #94a3b8;
            margin-bottom: 40px;
        }
        .careers-job-body {
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 24px;
            background: white;
        }
        .careers-job-section {
            margin-bottom: 48px;
        }
        .careers-job-section-title {
            font-size: 1.5rem;
            color: #0f172a;
            margin-bottom: 20px;
        }
        .careers-prose {
            color: #334155;
            line-height: 1.6;
        }
        .careers-prose ul {
            margin: 16px 0;
            padding-left: 24px;
        }
        .careers-prose li {
            margin-bottom: 8px;
        }
        .careers-job-note {
            margin-top: 48px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            color: #475569;
            font-size: 0.875rem;
        }
        .apply-email {
            color: #3b82f6;
            text-decoration: none;
        }
        .apply-email:hover {
            text-decoration: underline;
        }
        @media (max-width: 768px) {
            .careers-job-title { font-size: 1.75rem; }
            .careers-job-body { padding: 40px 20px; }
        }
    </style>
</head>
<body class="' . $bodyClass . '">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header>
        <nav id="navbar" aria-label="Main navigation">
            <div class="nav-inner">
                <a href="index.html" class="nav-logo">
                    <img src="images/logo-white.svg" alt="ITRB" width="171" height="38">
                </a>
                <ul class="nav-links" id="navLinks">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="who-we-are.html">Who we are</a></li>
                    <li><a href="careers.html" class="active">Careers</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <div class="nav-actions">
                    <div class="lang-switcher">
                        <button class="lang-btn ' . ($lang === 'en' ? 'active' : '') . '" data-lang="en">EN</button>
                        <span class="lang-sep">/</span>
                        <button class="lang-btn ' . ($lang === 'bg' ? 'active' : '') . '" data-lang="bg">BG</button>
                    </div>
                    <button class="hamburger" id="hamburger">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </nav>
    </header>

    <main id="main-content">
    <article class="careers-job">
        <header class="careers-job-header">
            <div class="container careers-job-header-inner">
                <a href="careers.html" class="careers-back">' . $backLink . '</a>
                <h1 class="careers-job-title">' . htmlspecialchars($job['title']) . '</h1>
                <p class="careers-job-meta">' . htmlspecialchars($job['location']) . ' · ' . htmlspecialchars($job['type']) . '</p>
            </div>
        </header>

        <div class="careers-job-body container">
            <section class="careers-job-section" aria-labelledby="responsibilities">
                <h2 id="responsibilities" class="careers-job-section-title">' . $responsibilitiesTitle . '</h2>
                <div class="careers-prose">
                    <p>' . nl2br(htmlspecialchars($job['description'])) . '</p>
                </div>
            </section>';
    
    // Добавяме изискванията, ако има
    if (!empty($job['requirements']) && count($job['requirements']) > 0) {
        $html .= '
            <section class="careers-job-section" aria-labelledby="requirements">
                <h2 id="requirements" class="careers-job-section-title">' . $requirementsTitle . '</h2>
                <div class="careers-prose">
                    <ul>';
        foreach ($job['requirements'] as $req) {
            $html .= '<li>' . htmlspecialchars($req) . '</li>';
        }
        $html .= '
                    </ul>
                </div>
            </section>';
    }
    
    // Добавяме "nice to have", ако има
    if (!empty($job['niceToHave']) && count($job['niceToHave']) > 0) {
        $html .= '
            <section class="careers-job-section" aria-labelledby="nice-to-have">
                <h2 id="nice-to-have" class="careers-job-section-title">' . $niceToHaveTitle . '</h2>
                <div class="careers-prose">
                    <ul>';
        foreach ($job['niceToHave'] as $nice) {
            $html .= '<li>' . htmlspecialchars($nice) . '</li>';
        }
        $html .= '
                    </ul>
                </div>
            </section>';
    }
    
    $html .= '
            <section class="careers-job-section" aria-labelledby="offer">
                <h2 id="offer" class="careers-job-section-title">' . $offerTitle . '</h2>
                <div class="careers-prose">
                    <p>' . $applyNote . '</p>
                    <p><a href="mailto:careers@itrb.org?subject=Application for ' . urlencode($job['title']) . '" class="apply-email">careers@itrb.org</a></p>
                </div>
            </section>

            <div class="careers-job-note">' . $confidentialNote . '</div>
        </div>
        </article>
    </main>

    <footer class="footer">
        <div class="container footer-inner">
            <a href="index.html" class="footer-logo">
                <img src="images/logo-white.svg" alt="ITRB" width="135" height="30">
            </a>
            <ul class="footer-nav">
                <li><a href="index.html">Home</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="who-we-are.html">Who we are</a></li>
                <li><a href="careers.html">Careers</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="privacy-policy.html">Privacy Policy</a></li>
            </ul>
            <p class="footer-copy">© 2026 ITRB. All rights reserved.</p>
        </div>
    </footer>

    <script src="js/main.js"></script>
    <script>
        document.querySelectorAll(".lang-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const lang = btn.dataset.lang;
                const currentSlug = window.location.pathname.split("/").pop().replace(".html", "").replace("careers-job-", "");
                window.location.href = `careers-job-${currentSlug}.html?lang=${lang}`;
            });
        });
    </script>
</body>
</html>';
    
    return ['filename' => $filename, 'content' => $html];
}

// Функция за генериране на всички страници за кариери
function generateAllCareerPages($data) {
    $generated = [];
    
    foreach (['en', 'bg'] as $lang) {
        if (isset($data[$lang]['careers']['positions'])) {
            foreach ($data[$lang]['careers']['positions'] as $job) {
                $result = generateCareerPage($job, $lang);
                file_put_contents($result['filename'], $result['content']);
                $generated[] = $result['filename'];
            }
        }
    }
    
    return $generated;
}

// ========================
// Main Request Handler
// ========================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if ($data) {
        // Създаваме папка data ако не съществува
        if (!file_exists('data')) {
            mkdir('data', 0755, true);
        }
        
        // Запазваме JSON файла
        $file = 'data/content.json';
        if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            // Генерираме HTML страниците за кариерите
            $generated = generateAllCareerPages($data);
            
            echo json_encode([
                'success' => true,
                'message' => 'Saved successfully. Generated ' . count($generated) . ' career pages.',
                'generated_files' => $generated
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Could not write to file']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    }
} else {
    // GET заявка - връщаме JSON файла
    if (file_exists('data/content.json')) {
        echo file_get_contents('data/content.json');
    } else {
        echo json_encode(['en' => [], 'bg' => []]);
    }
}
?>