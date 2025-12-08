#!/bin/bash

set -e
set -u

# WARNING: Commit all changes before running this script, as it will modify multiple files and also remove git!
# You can remove .git from the .ossignore if you want to see the changes easily.

# === CONFIGURATION VALUES FOR REPLACEMENTS ===
# TODO: Update with real values
REPO_URL="<YOUR_REPO_URL>"
PUBLISH_CONFIG_REGISTRY="<YOUR_PUBLISH_CONFIG_REGISTRY>"
CLIENT_PUBLISH_CONFIG_REGISTRY="<YOUR_CLIENT_PUBLISH_CONFIG_REGISTRY>"
KEYCLOAK_REGISTRY="KEYCLOAK_REGISTRY='quay.io'"
DOCKER_REGISTRY_FOR_READ="docker.io"
DOCKER_REGISTRY_FOR_PUBLISH="docker.io"
DOCKER_USE_CREDENTIALS="dockerUseCredentials=false"
# ======================

REPLACEMENTS=(
	"current: ssh://git@bitbucket.mgm-tp.com:7999/a12/full-stack-project-template.git | alternative: $REPO_URL",
	"current: https://artifacts.mgm-tp.com/artifactory/api/npm/a12-npm-local | alternative: $PUBLISH_CONFIG_REGISTRY"
	"current: https://artifacts.mgm-tp.com/artifactory/api/npm/your-project-name-npm-local | alternative: $CLIENT_PUBLISH_CONFIG_REGISTRY"
	"current: KEYCLOAK_REGISTRY='dockerregistry.mgm-tp.com' | alternative: $KEYCLOAK_REGISTRY"
	"current: dockerUseCredentials=true | alternative: $DOCKER_USE_CREDENTIALS"
	"current: your-project-name.dockerregistry.mgm-tp.com | alternative: $DOCKER_REGISTRY_FOR_PUBLISH"
	"current: dockerregistry.mgm-tp.com | alternative: $DOCKER_REGISTRY_FOR_READ"
	'current: https://client-a12-internal-project-template-${project.envName}.pidev.mgm-tp.com | alternative: https://your-domain.com'
)

# Files to process for replacements and block exclusions
FILES_TO_PROCESS_REPLACEMENTS=(
	"package.json"
	"client/package.json"
	"gradle.properties"
	"compose/.env"
	"build.gradle"
	"client/build.gradle"
	"settings.gradle"
	"e2e/build.gradle"
)

OSS_EXCLUDED_START="// === OSS - Excluded start ==="
OSS_EXCLUDED_END="// === OSS - Excluded end ==="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

sed_inplace() {
    local pattern="$1"
    local file="$2"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "$pattern" "$file"
    else
        # Linux and others
        sed -i "$pattern" "$file"
    fi
}

parse_replacement() {
    local replacement="$1"
    
    if [[ ! "$replacement" =~ ^current:[[:space:]].*[[:space:]]\|[[:space:]]alternative:[[:space:]] ]]; then
        print_error "ERROR: Invalid replacement format: $replacement"
        return 1
    fi
    
    local temp="${replacement#current: }"
    local current="${temp% | alternative:*}"
    local alternative="${temp##*| alternative: }"
    
    echo "$current|$alternative"
}

process_single_file() {
    local file="$1"
    local file_modified=false
    
    if grep -q "$OSS_EXCLUDED_START" "$file"; then
        sed_inplace "\#$OSS_EXCLUDED_START#,\#$OSS_EXCLUDED_END#d" "$file"
        file_modified=true
    fi
    
    for replacement in "${REPLACEMENTS[@]}"; do
        local parsed=$(parse_replacement "$replacement")
        IFS='|' read -r current alternative <<< "$parsed"
        
        if grep -q "$current" "$file"; then
            sed_inplace "s|$current|$alternative|g" "$file"
            file_modified=true
        fi
    done
    
    if [ "$file_modified" = true ]; then
        return 0
    fi
    return 1
}

process_all_files() {
    print_info "Processing files (removing excluded blocks and replacing strings)..."
    print_info "Files to process: ${FILES_TO_PROCESS_REPLACEMENTS[*]}"
    
    local total_files=0
    
    for file in "${FILES_TO_PROCESS_REPLACEMENTS[@]}"; do
        if [ -f "$file" ]; then
            if process_single_file "$file"; then
                print_success "  $file"
                total_files=$((total_files + 1))
            fi
        else
            print_warning "  File not found: $file"
        fi
    done
    
    echo ""
    if [ $total_files -gt 0 ]; then
        print_success "Successfully processed $total_files file(s)"
    else
        print_info "No files needed processing"
    fi
}

universalize_package_lock_files() {
    print_info "Running Gradle task to universalize package-lock.json files"
    
    if gradle :client:universalizePackageLock; then
        print_success "Successfully universalized package-lock.json files"
    else
        print_error "Failed to run Gradle task :client:universalizePackageLock"
        exit 1
    fi
}

remove_oss_excluded_files() {
    print_info "Remove oss excluded files based on .ossignore"
    
    if [ ! -f .ossignore ]; then
        print_error "Error: .ossignore file not found"
        exit 1
    fi
    
    while IFS= read -r pattern || [ -n "$pattern" ]; do
        [[ -z "$pattern" || "$pattern" =~ ^#.*$ ]] && continue
        
        if [ -e "$pattern" ]; then
            print_info "Removing: $pattern"
            rm -rf "$pattern"
        fi
    done < .ossignore

    echo ""
    print_success "Successfully removed OSS excluded files"
}

main() {
	print_info "PREPARE PROJECT TEMPLATE FOR OPEN-SOURCE"
	echo ""

	process_all_files
	echo ""

    universalize_package_lock_files
	echo ""

    remove_oss_excluded_files
	echo ""

	print_success "OSS preparation complete!"
}

main